import { useCallback, useEffect, useRef, useState } from "react";
import doConfettiBurst from "../utils/doConfettiBurst";
import { useAccount } from "wagmi";
import { usePortfolioContext } from "../context/PortfolioContext";
import { Message } from "../types";

const useChatEventStream = (prompt: string) => {
    const account = useAccount()
    const isStreaming = useRef(false)
    const [streamedContent, setStreamedContent] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const { fetchPortfolio } = usePortfolioContext();
    const [functionCalls, setFunctionCalls] = useState<Message[]>([]);
    const [functionResults, setFunctionResults] = useState<Message[]>([]);

    const sendConfirmation = useCallback(async (transactionId: string, confirmed: boolean) => {
        try {
            const response = await fetch('/api/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId, confirmed }),
            });

            if (!response.ok) {
                console.error('Failed to send confirmation:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending confirmation:', error);
        }
    }, []);

    const doPrompt = useCallback((p: string, isDemo: boolean) => {
        setIsThinking(true);
        const eventSource = new EventSource(
            `/api/stream?content=${p}${isDemo ? `&demo=true` : ""}`
        );

        eventSource.addEventListener("functionCall", (event: MessageEvent) => {
            const obj = JSON.parse(event.data);
            obj.arguments = obj.arguments ? JSON.parse(obj.arguments) : {};
            console.log("functionCall:", obj);
            if (obj.name === "confettiBurst") {
                doConfettiBurst();
                return;
            }
            setFunctionCalls((prev) => [...prev, { message: "", type: "assistant", completed: true, functionCall: obj }])
        });

        eventSource.addEventListener("functionCallResult", (event: MessageEvent) => {
            const obj = JSON.parse(event.data);
            console.log("functionCallResult:", obj);
            if (obj.section || obj.confettiBurst) return;
            if (obj.transactionHash) {
                fetchPortfolio()
            }

            setFunctionResults((prev) => [...prev, { message: "", type: "function", completed: true, functionCall: obj }])
        });

        eventSource.addEventListener("confirmation", (event: MessageEvent) => {
            const obj = JSON.parse(event.data);
            console.log("confirmation:", obj);
            setFunctionCalls((prev) => [...prev, {
                message: obj.message,
                type: "assistant",
                completed: false,
                functionCall: obj.functionCall,
                waitingForConfirmation: true,
                transactionId: obj.transactionId
            }]);
        });

        eventSource.addEventListener("open", () => {
            // setStreamedContent("");
        });

        eventSource.onmessage = (event) => {
            const chunk: string = JSON.parse(event.data);
            setIsThinking(false);
            setStreamedContent((prev) => {
                const newContent = prev + chunk;
                return newContent;
            });
        };

        eventSource.addEventListener("end", () => {
            setIsThinking(false);
            eventSource.close();
        });

        eventSource.onerror = (err: Event) => {
            console.error("EventSource error:", err);
            setIsThinking(false);
            eventSource.close();
        };

        // Clean up when the effect is unmounted.
        return () => {
            eventSource.close();
        };
    }, [
        fetchPortfolio,
        setStreamedContent,
    ]);

    useEffect(() => {
        if (isStreaming.current) return;
        isStreaming.current = true;
        doPrompt(prompt, !account?.isConnected)
    }, [doPrompt, prompt, account])

    return { streamedContent, functionCalls, functionResults, isThinking, sendConfirmation };
};

export default useChatEventStream;
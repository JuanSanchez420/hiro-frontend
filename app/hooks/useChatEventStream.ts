import { useCallback, useEffect, useRef, useState } from "react";
import useDoABarrelRoll from "./useDoABarrelRoll";
import doConfettiBurst from "../utils/doConfettiBurst";
import { useGlobalContext } from "../context/GlobalContext";
import { Message } from "../context/PromptsContext";
import { useAccount } from "wagmi";
import { usePortfolioContext } from "../context/PortfolioContext";

const useChatEventStream = (prompt: string) => {
    const account = useAccount()
    const isStreaming = useRef(false)
    const [streamedContent, setStreamedContent] = useState("");
    const { setShowConfirm, setRain } = useGlobalContext();
    const { fetchPortfolio } = usePortfolioContext();
    const doABarrelRoll = useDoABarrelRoll();
    const [functionCalls, setFunctionCalls] = useState<Message[]>([]);
    const [functionResults, setFunctionResults] = useState<Message[]>([]);

    const doPrompt = useCallback((p: string, isDemo: boolean) => {
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
            if (obj.name === "doABarrelRoll") {
                doABarrelRoll();
                return;
            }
            if (obj.name === "makeItRain") {
                setRain(obj.arguments.symbol);
                return
            }
            if (obj.name === "confirm") {
                setShowConfirm(true);
                return;
            }
            setFunctionCalls((prev) => [...prev, { message: "", type: "assistant", completed: true, functionCall: obj }])
        });

        eventSource.addEventListener("functionCallResult", (event: MessageEvent) => {
            const obj = JSON.parse(event.data);
            console.log("functionCallResult:", obj);
            if (obj.section || obj.confettiBurst || obj.barrelRoll || obj.madeItRain) return;
            if (obj.transactionHash) {
                fetchPortfolio()
            }

            setFunctionResults((prev) => [...prev, { message: "", type: "function", completed: true, functionCall: obj }])
        });

        eventSource.addEventListener("open", () => {
            // setStreamedContent("");
        });

        eventSource.onmessage = (event) => {
            const chunk: string = JSON.parse(event.data);
            setStreamedContent((prev) => {
                const newContent = prev + chunk;
                return newContent;
            });
        };

        eventSource.addEventListener("end", () => {
            eventSource.close();
        });

        eventSource.onerror = (err: Event) => {
            console.error("EventSource error:", err);
            eventSource.close();
        };

        // Clean up when the effect is unmounted.
        return () => {
            eventSource.close();
        };
    }, [
        doABarrelRoll,
        fetchPortfolio,
        setRain,
        setShowConfirm,
        setStreamedContent,
    ]);

    useEffect(() => {
        if (isStreaming.current) return;
        isStreaming.current = true;
        doPrompt(prompt, !account?.isConnected)
    }, [doPrompt, prompt, account])

    return { streamedContent, functionCalls, functionResults };
};

export default useChatEventStream;
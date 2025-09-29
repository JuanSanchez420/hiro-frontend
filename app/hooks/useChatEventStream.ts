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
                return;
            }

            const responseData = await response.json();
            console.log('Confirmation response:', responseData);

            // Update the function call message to mark it as completed
            setFunctionCalls((prev) =>
                prev.map((call) =>
                    call.transactionId === transactionId
                        ? { ...call, completed: true, waitingForConfirmation: false }
                        : call
                )
            );

            // If confirmation was successful and we have a result, add it to function results
            if (confirmed && responseData.success && responseData.result) {
                try {
                    const parsedResult = JSON.parse(responseData.result);
                    const functionResult: Message = {
                        message: "",
                        type: "function",
                        completed: true,
                        functionCall: {
                            ...parsedResult,
                            transactionId: responseData.transactionId || transactionId
                        }
                    }
                    
                    setFunctionResults((prev) => [...prev, functionResult]);
                    
                    // Fetch updated portfolio if we have a transaction hash
                    if (parsedResult.transactionHash) {
                        fetchPortfolio();
                    }
                } catch (parseError) {
                    console.error('Failed to parse confirmation result:', parseError, responseData.result);
                }
            } else if (confirmed) {
                // Fallback: fetch portfolio even without parsed result
                fetchPortfolio();
            }
        } catch (error) {
            console.error('Error sending confirmation:', error);
        }
    }, [fetchPortfolio]);

    const doPrompt = useCallback((p: string, isDemo: boolean) => {
        setIsThinking(true);
        // Clear previous state to prevent stale data from being displayed
        setStreamedContent("");
        setFunctionCalls([]);
        setFunctionResults([]);

        const eventSource = new EventSource(
            `/api/stream?content=${p}${isDemo ? `&demo=true` : ""}`
        );

        eventSource.addEventListener("functionCall", (event: MessageEvent) => {
            try {
                const obj = JSON.parse(event.data);

                // Validate that this is actually a function call
                if (!obj || typeof obj !== 'object' || !obj.name) {
                    console.warn("Invalid functionCall event data:", obj);
                    return;
                }

                // Safely parse arguments
                try {
                    obj.arguments = obj.arguments ? JSON.parse(obj.arguments) : {};
                } catch (argError) {
                    console.error("Failed to parse function call arguments:", argError, obj.arguments);
                    obj.arguments = {};
                }

                console.log("functionCall:", obj);
                if (obj.name === "confettiBurst") {
                    doConfettiBurst();
                    return;
                }
                setFunctionCalls((prev) => [...prev, { message: "", type: "assistant", completed: true, functionCall: obj }])
            } catch (error) {
                console.error("Failed to parse functionCall event:", error, event.data);
            }
        });

        eventSource.addEventListener("functionCallResult", (event: MessageEvent) => {
            try {
                const obj = JSON.parse(event.data);
                console.log("functionCallResult:", obj);

                // Skip certain result types
                if (obj.section || obj.confettiBurst) return;

                if (obj.transactionHash) {
                    fetchPortfolio()
                }

                // Create the function result with proper structure
                const functionResult: Message = {
                    message: "",
                    type: "function",
                    completed: true,
                    functionCall: {
                        ...obj,
                        // Preserve transactionId if available
                        transactionId: obj.transactionId
                    }
                }

                setFunctionResults((prev) => [...prev, functionResult])
            } catch (error) {
                console.error("Failed to parse functionCallResult event:", error, event.data);
            }
        });

        eventSource.addEventListener("confirmation", (event: MessageEvent) => {
            try {
                const obj = JSON.parse(event.data);
                console.log("confirmation:", obj);
                
                // Parse function call arguments if they're still a string
                const functionCall = { ...obj.functionCall };
                if (functionCall && typeof functionCall.arguments === 'string') {
                    try {
                        functionCall.arguments = JSON.parse(functionCall.arguments);
                    } catch (parseError) {
                        console.error("Failed to parse function call arguments:", parseError);
                        functionCall.arguments = {};
                    }
                }
                
                setFunctionCalls((prev) => [...prev, {
                    message: obj.message,
                    type: "assistant",
                    completed: false,
                    functionCall: functionCall,
                    waitingForConfirmation: true,
                    transactionId: obj.transactionId
                }]);
            } catch (error) {
                console.error("Failed to parse confirmation event:", error, event.data);
            }
        });

        eventSource.addEventListener("open", () => {
            // setStreamedContent("");
        });

        eventSource.onmessage = (event) => {
            try {
                const chunk: string = JSON.parse(event.data);

                // Validate that this is actually a string chunk for streaming content
                if (typeof chunk !== 'string') {
                    console.warn("Invalid streaming content chunk (not a string):", chunk);
                    return;
                }

                setIsThinking(false);
                setStreamedContent((prev) => {
                    const newContent = prev + chunk;
                    return newContent;
                });
            } catch (error) {
                console.error("Failed to parse streaming content:", error, event.data);
            }
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
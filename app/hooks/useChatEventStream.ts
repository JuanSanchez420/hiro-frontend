import { useCallback, useEffect, useRef, useState } from "react";
import doConfettiBurst from "../utils/doConfettiBurst";
import { useAccount } from "wagmi";
import { usePortfolioContext } from "../context/PortfolioContext";
import { Message } from "../types";

const useChatEventStream = (prompt: string) => {
    const account = useAccount()
    const isStreaming = useRef(false)
    const messageIdCounter = useRef(0)
    const [streamedContent, setStreamedContent] = useState("");
    const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const { fetchPortfolio } = usePortfolioContext();
    const [functionCalls, setFunctionCalls] = useState<Message[]>([]);
    const [functionResults, setFunctionResults] = useState<Message[]>([]);
    const [assistantMessages, setAssistantMessages] = useState<Message[]>([]);
    const [confirmationLoading, setConfirmationLoading] = useState(false);

    const sendConfirmation = useCallback(async (transactionId: string, confirmed: boolean) => {
        setConfirmationLoading(true);
        try {
            const response = await fetch('/api/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId, confirmed }),
            });

            const responseData = await response.json();

            if (!response.ok) {

                // Display error message from backend
                if (responseData.error || responseData.message) {
                    const id = messageIdCounter.current++;
                    const errorMessage: Message = {
                        id,
                        message: responseData.message || `Error: ${responseData.error}`,
                        type: "assistant",
                        completed: true
                    };
                    setAssistantMessages((prev) => [...prev, errorMessage]);
                }

                // Mark the function call as completed (failed)
                setFunctionCalls((prev) =>
                    prev.map((call) =>
                        call.transactionId === transactionId
                            ? { ...call, completed: true, waitingForConfirmation: false }
                            : call
                    )
                );
                return;
            }

            // Add the response message as an assistant message if it exists
            if (responseData.message) {
                const id = messageIdCounter.current++;
                const assistantMessage: Message = {
                    id,
                    message: responseData.message,
                    type: "assistant",
                    completed: true
                };
                setAssistantMessages((prev) => [...prev, assistantMessage]);
            }

            // Update the function call message to mark it as completed
            setFunctionCalls((prev) =>
                prev.map((call) =>
                    call.transactionId === transactionId
                        ? { ...call, completed: true, waitingForConfirmation: false }
                        : call
                )
            );

            // If there's a nested confirmation, add it to function calls
            if (confirmed && responseData.confirmation) {
                const nestedConfirmation = responseData.confirmation;

                // Parse function call arguments if they're a string
                const functionCall = { ...nestedConfirmation.functionCall };
                if (functionCall && typeof functionCall.arguments === 'string') {
                    try {
                        functionCall.arguments = JSON.parse(functionCall.arguments);
                    } catch (parseError) {
                        console.error("Failed to parse nested confirmation arguments:", parseError);
                        functionCall.arguments = {};
                    }
                }

                const id = messageIdCounter.current++;
                setFunctionCalls((prev) => [...prev, {
                    id,
                    message: nestedConfirmation.message,
                    type: "assistant",
                    completed: false,
                    functionCall: functionCall,
                    waitingForConfirmation: true,
                    transactionId: nestedConfirmation.transactionId
                }]);
            }

            // If confirmation was successful and we have a result, add it to function results
            if (confirmed && responseData.success && responseData.result) {
                try {
                    const parsedResult = JSON.parse(responseData.result);
                    const id = messageIdCounter.current++;
                    const functionResult: Message = {
                        id,
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
                        fetchPortfolio().catch((error) => {
                            console.error('[useChatEventStream] Error fetching portfolio after confirmation:', error);
                        });
                    }
                } catch (parseError) {
                    console.error('Failed to parse confirmation result:', parseError, responseData.result);
                }
            } else if (confirmed) {
                // Fallback: fetch portfolio even without parsed result
                fetchPortfolio().catch((error) => {
                    console.error('[useChatEventStream] Error fetching portfolio after confirmation fallback:', error);
                });
            } else if (responseData.cancelled) {
                // User cancelled the transaction - add cancellation result
                const id = messageIdCounter.current++;
                const cancelledResult: Message = {
                    id,
                    message: "",
                    type: "function",
                    completed: true,
                    functionCall: {
                        status: "cancelled",
                        message: "Transaction cancelled by user",
                        transactionId: responseData.transactionId || transactionId
                    }
                }

                setFunctionResults((prev) => [...prev, cancelledResult]);
            }
        } catch (error) {
            console.error('Error sending confirmation:', error);
        } finally {
            setConfirmationLoading(false);
        }
    }, [fetchPortfolio]);

    const doPrompt = useCallback((p: string, isDemo: boolean) => {
        setIsThinking(true);
        // Clear previous state to prevent stale data from being displayed
        messageIdCounter.current = 0;
        setStreamedContent("");
        setStreamingMessageId(null);
        setFunctionCalls([]);
        setFunctionResults([]);
        setAssistantMessages([]);
        setConfirmationLoading(false);

        const eventSource = new EventSource(
            `/api/stream?content=${p}${isDemo ? `&demo=true` : ""}`
        );

        eventSource.addEventListener("functionCall", (event: MessageEvent) => {
            try {
                const obj = JSON.parse(event.data);

                // Validate that this is actually a function call
                if (!obj || typeof obj !== 'object' || !obj.name) {
                    return;
                }

                // Safely parse arguments
                try {
                    obj.arguments = obj.arguments ? JSON.parse(obj.arguments) : {};
                } catch (argError) {
                    console.error("Failed to parse function call arguments:", argError, obj.arguments);
                    obj.arguments = {};
                }

                if (obj.name === "confettiBurst") {
                    doConfettiBurst();
                    return;
                }
                const id = messageIdCounter.current++;
                setFunctionCalls((prev) => [...prev, { id, message: "", type: "assistant", completed: true, functionCall: obj }])
            } catch (error) {
                console.error("Failed to parse functionCall event:", error, event.data);
            }
        });

        eventSource.addEventListener("functionCallResult", (event: MessageEvent) => {
            try {
                const obj = JSON.parse(event.data);

                // Skip certain result types
                if (obj.section || obj.confettiBurst) return;

                if (obj.transactionHash) {
                    fetchPortfolio().catch((error) => {
                        console.error('[useChatEventStream] Error fetching portfolio after transaction:', error);
                    });
                }

                // Create the function result with proper structure
                const id = messageIdCounter.current++;
                const functionResult: Message = {
                    id,
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
                
                const id = messageIdCounter.current++;
                setFunctionCalls((prev) => [...prev, {
                    id,
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
                    return;
                }

                setIsThinking(false);
                setStreamedContent((prev) => {
                    // Assign ID on first chunk
                    if (prev === "") {
                        setStreamingMessageId(messageIdCounter.current++);
                    }
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

    return { streamedContent, streamingMessageId, functionCalls, functionResults, assistantMessages, isThinking, confirmationLoading, sendConfirmation };
};

export default useChatEventStream;
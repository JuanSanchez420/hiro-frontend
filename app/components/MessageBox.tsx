import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import WandSpinner from "./WandSpinner";
import Image from "next/image"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { prettyValue } from "../utils/prettyValue";
import useChatEventStream from "../hooks/useChatEventStream";
import { Message } from "../types";
import Confirm from "./Confirm";

const friendlyNames = {
    "getETHBalance": "Get ETH Balance",
    "getPrices": "Get Prices",
    "swap": "Swap",
    "wrapETH": "Wrap ETH",
    "unwrapWETH": "Unwrap WETH",
    "addLiquidity": "Add Liquidity",
    "removeLiquidityByIndex": "Remove Liquidity",
    "setAutonomousInstructions": "Set Autonomous Instructions",
    'swapDemo': 'Swap Demo',
    'addLiquidityDemo': 'Add Liquidity Demo',
    'setAutonomousInstructionsDemo': 'Set Autonomous Instructions Demo',
    "depositAave": "Deposit Aave",
    "withdrawAave": "Withdraw Aave",
    "getPortfolioTool": "Get Portfolio",
    "borrowAave": "Borrow Aave",
    "repayAave": "Repay Aave",
    "": ""
}

const parseMessage = (message: string) => {
    const segments = [];
    const regex = /(###.*?(?=\n|$)|\*\*.*?\*\*|```[\s\S]*?```|\n)/g; // Updated regex to include headers and newline characters
    let lastIndex = 0;

    message.replace(regex, (match, _, offset) => {
        // Add normal text before the match
        if (offset > lastIndex) {
            segments.push({ type: "text", content: message.slice(lastIndex, offset) });
        }

        // Handle special cases
        if (match.startsWith("###")) {
            segments.push({ type: "header", content: match.slice(3).trim() }); // Remove ### and trim spaces
        } else if (match.startsWith("**")) {
            segments.push({ type: "bold", content: match.slice(2, -2) });
        } else if (match.startsWith("```")) {
            segments.push({ type: "quote", content: match.slice(3, -3).trim() }); // Trim extra spaces
        } else if (match === "\n") {
            segments.push({ type: "newline" }); // Add a newline segment
        }

        lastIndex = offset + match.length;
        return match;
    });

    // Add remaining normal text
    if (lastIndex < message.length) {
        segments.push({ type: "text", content: message.slice(lastIndex) });
    }

    return segments;
};

const UserMessage = ({ message }: { message: Message }) => {
    const segments = parseMessage(message.message);
    return (
        <div className="flex w-full justify-end my-3">
            <div className={`rounded-3xl bg-gray-100 px-4 py-2 text-gray-900`}>
                {segments.map((segment, index) => {
                    switch (segment.type) {
                        case "header":
                            return (
                                <h3 key={index} className="text-lg font-bold my-1 block">
                                    {segment.content}
                                </h3>
                            );
                        case "bold":
                            return (
                                <span key={index} className="inline-block font-bold">
                                    {segment.content}
                                </span>
                            );
                        case "quote":
                            return (
                                <span key={index} className="inline-block bg-gray-200 p-1 rounded italic">
                                    {segment.content}
                                </span>
                            );
                        case "newline":
                            return <br key={index} />;
                        default:
                            return <span key={index}>{segment.content}</span>;
                    }
                })}
            </div>
        </div>
    )
}

const AssistantMessage = ({ message }: { message: Message }) => {
    const segments = parseMessage(message.message);
    return (
        <div className="flex w-full py-5 my-2">
            <Avatar />
            <div>
                {segments.map((segment, index) => {
                    switch (segment.type) {
                        case "header":
                            return (
                                <h3 key={index} className="text-lg font-bold my-1 block">
                                    {segment.content}
                                </h3>
                            );
                        case "bold":
                            return (
                                <span key={index} className="inline-block font-bold">
                                    {segment.content}
                                </span>
                            );
                        case "quote":
                            return (
                                <span key={index} className="inline-block bg-gray-200 p-1 rounded italic">
                                    {segment.content}
                                </span>
                            );
                        case "newline":
                            return <br key={index} />;
                        default:
                            return <span key={index}>{segment.content}</span>;
                    }
                })}
            </div>
        </div>
    )
}


const FunctionResults = ({ call, result, sendConfirmation }: {
    call: Message,
    result?: Message,
    sendConfirmation?: (transactionId: string, confirmed: boolean) => void
}) => {

    const [gradient, setGradient] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setGradient(false)
        }, 10000)

        return () => clearTimeout(timer)
    }, [])

    const hasConfirmation = call.waitingForConfirmation
    const confirmationMessage = call.message
    const transactionId = call.transactionId

    const handleConfirm = (transactionId: string, confirmed: boolean) => {
        sendConfirmation?.(transactionId, confirmed)
    }

    const inputs = useMemo(() => {
        // Validate function call and arguments
        if (!call.functionCall || !call.functionCall.arguments || typeof call.functionCall.arguments !== 'object') {
            return [];
        }

        return Object.entries(call.functionCall.arguments).map(([key, value]) => {
            // Safely convert value to string and handle potential streaming content corruption
            let displayValue = value;
            if (typeof value === 'object') {
                try {
                    displayValue = JSON.stringify(value);
                } catch {
                    displayValue = '[Invalid Object]';
                }
            } else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
                displayValue = String(value);
            }

            return (
                <div key={`call-${key}`} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-gray-900 ml-4">{displayValue}</span>
                </div>
            )
        })
    }, [call])

    const outputs = useMemo(() => {
        if (!result?.functionCall) return [];

        return Object.entries(result.functionCall)
            .filter(([key]) => key !== 'transactionId')
            .map(([key, value]) => {
                const formatted = prettyValue(value)
                const isMultiLine = formatted.includes('\n')
                const isTxHash = key === "transactionHash" && typeof value === 'string'
                const displayValue = isTxHash && value.length > 16
                    ? `${value.slice(0, 10)}...${value.slice(-6)}`
                    : formatted

                return (
                    <div key={`result-${key}`} className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-gray-500 font-medium">{key}</span>
                        <div className="flex items-center ml-4">
                            {isMultiLine ? (
                                <pre className="text-gray-900 text-xs whitespace-pre-wrap">{formatted}</pre>
                            ) : (
                                <span className="text-gray-900">{displayValue}</span>
                            )}
                            {isTxHash && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(value || "")}
                                    className="ml-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                    </div>
                )
            })
    }, [result])

    const txHash = useMemo(() => {
        return result?.functionCall?.transactionHash || ""
    }, [result])

    const isDemo = txHash === '0xdummytxhash'

    const handleTxLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDemo) {
            e.preventDefault();
            // Optionally alert or log for demo users
        }
    };

    const name = useMemo(() => {
        return friendlyNames[call.functionCall?.name as keyof typeof friendlyNames || ""]
    }, [call])

    if (inputs.length === 0 && outputs.length === 0 && !hasConfirmation) return null

    return (
        <div className="w-full py-5">
            {(inputs.length > 0 || outputs.length > 0) && (
                <Disclosure as="div" defaultOpen={false}>
                    {({ }) => (
                        <>
                            <DisclosureButton className="group w-full text-left">
                                <div className="flex flex-1 items-center mb-3 w-full pl-3">
                                    <WandSpinner />
                                    <div className={`flex flex-1 items-center italic ${gradient ? `gradient-text` : ``}`}>{name}</div>
                                    <div className="flex flex-1 items-center italic justify-end">
                                        <a href="https://basescan.org/tx/" target="_blank" onClick={handleTxLinkClick} className="flex text-sm items-center">Basescan <ArrowTopRightOnSquareIcon className="size-5 ml-1 mr-5" /></a>
                                    </div>
                                    <ChevronDownIcon className="size-6 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                                </div>
                            </DisclosureButton>
                            <DisclosurePanel
                                transition
                                className="overflow-hidden py-2 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                            >
                                {inputs.length > 0 && (
                                    <>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-3">Inputs</div>
                                        <div className="px-3 space-y-1">{inputs}</div>
                                    </>
                                )}
                                {outputs.length > 0 && (
                                    <>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 mt-4 px-3">Outputs</div>
                                        <div className="px-3 space-y-1">{outputs}</div>
                                    </>
                                )}
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>
            )}
            {hasConfirmation && (
                <Confirm
                    show={hasConfirmation}
                    transactionId={transactionId}
                    message={confirmationMessage}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}

const Avatar = ({ isAnimated = false }: { isAnimated?: boolean }) => {
    return (<div className={`shrink-0 mr-2 ${isAnimated ? 'animate-bounce' : ''}`}>
        <Image src="/images/hiro.png" height={32} width={32} alt="hiro" />
    </div>)
}

const StreamedContent = ({ streamedContent }: { streamedContent: string }) => {

    const segments = parseMessage(streamedContent || "")

    const s = useMemo(() => segments.map((segment, index) => {
        switch (segment.type) {
            case "header":
                return (
                    <h3 key={index} className="text-lg font-bold my-1 block">
                        {segment.content}
                    </h3>
                );
            case "bold":
                return (
                    <span key={index} className="inline-block font-bold">
                        {segment.content}
                    </span>
                );
            case "quote":
                return (
                    <span key={index} className="inline-block bg-gray-200 p-1 rounded italic">
                        {segment.content}
                    </span>
                );
            case "newline":
                return <br key={index} />;
            default:
                return segment.content;
        }
    }), [segments])

    if (!streamedContent) return null

    return s
}

export const PromptAndResponse = ({ prompt }: { prompt: string }) => {
    const bottomRef = useRef<HTMLDivElement>(null)

    const { streamedContent, functionCalls, functionResults, assistantMessages, isThinking, confirmationLoading, sendConfirmation } = useChatEventStream(prompt)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [streamedContent, functionCalls, functionResults, assistantMessages]);

    const message = { type: "user", message: prompt, completed: true } as Message

    // Create a map of results by transactionId for quick lookup
    const resultsByTransactionId = useMemo(() => {
        const map = new Map<string, Message>()
        functionResults.forEach(result => {
            const txId = result.functionCall?.transactionId
            if (txId && typeof txId === 'string') {
                map.set(txId, result)
            }
        })
        return map
    }, [functionResults])

    return (
        <div>
            <UserMessage message={message} />
            {functionCalls.map((call, index) => {
                const result = call.transactionId ? resultsByTransactionId.get(call.transactionId) : undefined
                return (
                    <FunctionResults
                        key={`call-${index}`}
                        call={call}
                        result={result}
                        sendConfirmation={sendConfirmation}
                    />
                )
            })}
            {assistantMessages.map((assistantMessage, index) => (
                <AssistantMessage key={`assistant-${index}`} message={assistantMessage} />
            ))}
            {(isThinking || streamedContent || confirmationLoading) && <div className="flex w-full py-5 my-2">
                <Avatar isAnimated={isThinking || confirmationLoading} />
                <div>
                    {streamedContent ? <StreamedContent streamedContent={streamedContent} /> : null}
                    {confirmationLoading && !streamedContent ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div> : null}
                </div>
            </div>}
            <div ref={bottomRef} />
        </div>
    )
}


export default PromptAndResponse;
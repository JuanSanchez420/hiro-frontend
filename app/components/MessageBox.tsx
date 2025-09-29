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
    "makeItRain": "Make it Rain",
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


const FunctionResults = ({ call, result, sendConfirmation }: {
    call: Message,
    result?: Message,
    sendConfirmation?: (transactionId: string, confirmed: boolean) => void
}) => {

    const [gradient, setGradient] = useState(true)

    setTimeout(() => {
        setGradient(false)
    }, 10000)

    const hasConfirmation = call.waitingForConfirmation
    const confirmationMessage = call.message
    const transactionId = call.transactionId

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
                <div key={`call-${key}`} className="flex items-center justify-between gap-1">
                    <div className="w-1/3 text-right text-sm">{key}</div>
                    <div className="w-2/3 text-right text-sm">{displayValue}</div>
                </div>
            )
        })
    }, [call])

    const outputs = useMemo(() => {
        if (!result?.functionCall) return [];
        
        return Object.entries(result.functionCall).map(([key, value]) => {
            const formatted = prettyValue(value)
            const isMultiLine = formatted.includes('\n')
            return (
                <div
                    key={`result-${key}`}
                    className="flex items-start justify-between gap-1"
                >
                    <div className="w-1/3 text-right text-sm pt-1">{key}</div>
                    <div className="w-2/3 flex flex-col items-end gap-1">
                        {isMultiLine ? (
                            <pre className="w-full overflow-auto rounded p-2 text-xs whitespace-pre-wrap break-words">{formatted}</pre>
                        ) : (
                            <span className="overflow-hidden text-ellipsis text-sm max-w-full break-words">{formatted}</span>
                        )}
                        {key === "transactionHash" && typeof value === 'string' && (
                            <button
                                onClick={() => navigator.clipboard.writeText(value || "")}
                                className="self-end rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-400"
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
        <Disclosure as="div" className="w-full py-5">
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
            <div className="overflow-hidden py-2">
                <DisclosurePanel
                    transition
                    className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                >
                    <div className="flex justify-center border-b mb-1">INPUTS</div>
                    <div>{inputs}</div>
                    <div className="flex justify-center border-b mb-1">OUTPUTS</div>
                    <div>{outputs}</div>
                </DisclosurePanel>
            </div>
            {hasConfirmation && (
                <Confirm
                    show={hasConfirmation}
                    transactionId={transactionId}
                    message={confirmationMessage}
                    onConfirm={sendConfirmation}
                />
            )}
        </Disclosure>
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

    const { streamedContent, functionCalls, functionResults, isThinking, sendConfirmation } = useChatEventStream(prompt)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [streamedContent, functionCalls, functionResults]);

    const message = { type: "user", message: prompt, completed: true } as Message

    // Group function calls and results by transactionId
    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: { call: Message, result?: Message } } = {}
        
        // Add function calls
        functionCalls.forEach((call, index) => {
            const key = call.transactionId || `call-${index}`
            groups[key] = { call }
        })
        
        // Match results to calls by transactionId or order
        functionResults.forEach((result, index) => {
            // Try to find a matching call by transactionId first
            let matchingKey: string | undefined
            
            if (result.functionCall?.transactionId && typeof result.functionCall.transactionId === 'string') {
                matchingKey = result.functionCall.transactionId
            } else {
                // Fall back to matching by order for results without transactionId
                const keys = Object.keys(groups)
                matchingKey = keys[index]
            }
            
            if (matchingKey && groups[matchingKey]) {
                groups[matchingKey].result = result
            } else {
                // If no matching call found, create a new group for the result
                const fallbackKey = `result-${index}`
                groups[fallbackKey] = {
                    call: { 
                        message: "", 
                        type: "assistant", 
                        completed: true, 
                        functionCall: result.functionCall 
                    } as Message,
                    result
                }
            }
        })
        
        return Object.entries(groups).map(([key, transaction]) => ({ ...transaction, key }))
    }, [functionCalls, functionResults])

    return (
        <div>
            <UserMessage message={message} />
            {groupedTransactions.map((transaction) => (
                <FunctionResults 
                    key={transaction.key}
                    call={transaction.call} 
                    result={transaction.result} 
                    sendConfirmation={sendConfirmation} 
                />
            ))}
            {(isThinking || streamedContent) && <div className="flex w-full py-5 my-2">
                <Avatar isAnimated={isThinking} />
                <div>
                    {streamedContent ? <StreamedContent streamedContent={streamedContent} /> : null}
                </div>
            </div>}
            <div ref={bottomRef} />
        </div>
    )
}


export default PromptAndResponse;
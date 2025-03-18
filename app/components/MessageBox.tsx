import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import WandSpinner from "./WandSpinner";
import Image from "next/image"
import { Message } from "../context/PromptsContext";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useChatEventStream from "../hooks/useChatEventStream";

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
    "": ""
}

const parseMessage = (message: string) => {
    const segments = [];
    const regex = /(\*\*.*?\*\*|```[\s\S]*?```|\n)/g; // Updated regex to include newline characters
    let lastIndex = 0;

    message.replace(regex, (match, _, offset) => {
        // Add normal text before the match
        if (offset > lastIndex) {
            segments.push({ type: "text", content: message.slice(lastIndex, offset) });
        }

        // Handle special cases
        if (match.startsWith("**")) {
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
            <div className="rounded-3xl bg-gray-100 px-4 py-2">
                {segments.map((segment, index) => {
                    switch (segment.type) {
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


const FunctionResults = ({ calls, results }: { calls: Message[], results: Message[] }) => {

    const [gradient, setGradient] = useState(true)

    setTimeout(() => {
        setGradient(false)
    }, 10000)

    const inputs = useMemo(() => {
        return calls.flatMap((call, index) => {
            return Object.entries(call.functionCall?.arguments || {}).map(([key, value]) => (
                <div key={`call-${key}-${index}`} className="flex items-center justify-between gap-1">
                    <div className="w-1/3 text-right text-sm">{key}</div>
                    <div className="w-2/3 text-right text-sm">{value}</div>
                </div>
            )
            )
        })
    }, [calls])

    const outputs = useMemo(() => {
        return results.flatMap((result, index) => {
            return Object.entries(result.functionCall || {}).map(([key, value]) => (
                <div
                    key={`result-${key}-${index}`}
                    className="flex items-center justify-between gap-1"
                >
                    <div className="w-1/3 text-right text-sm">{key}</div>
                    <div className="w-2/3 flex items-center justify-end gap-2">
                        <span className="overflow-hidden text-ellipsis text-sm">{value?.toString()}</span>
                        {key === "transactionHash" && (
                            <button
                                onClick={() => navigator.clipboard.writeText(value?.toString() || "")}
                                className="ml-2 rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-400"
                            >
                                Copy
                            </button>
                        )}
                    </div>
                </div>
            ))
        })
    }, [results])

    const txHash = useMemo(() => {
        return results[0]?.functionCall?.transactionHash || ""
    }, [results])

    const isDemo = txHash === '0xdummytxhash'

    const handleTxLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDemo) {
            e.preventDefault();
            // Optionally alert or log for demo users
        }
    };

    const names = useMemo(() => {
        const n = calls.map(call => friendlyNames[call.functionCall?.name as keyof typeof friendlyNames || ""])
        return n.join(", ")
    }, [calls])

    if (inputs.length === 0 && outputs.length === 0) return null

    return (
        <Disclosure as="div" className="w-full py-5">
            <DisclosureButton className="group w-full text-left">
                <div className="flex flex-1 items-center mb-3 w-full pl-3">
                    <WandSpinner />
                    <div className={`flex flex-1 items-center italic ${gradient ? `gradient-text` : ``}`}>{names}</div>
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
        </Disclosure>
    );
}

const Avatar = () => {
    return (<div className="shrink-0 mr-2">
        <Image src="/images/hiro.png" height={32} width={32} alt="hiro" />
    </div>)
}

const StreamedContent = ({ streamedContent }: { streamedContent: string }) => {

    const segments = parseMessage(streamedContent || "")

    const s = useMemo(() => segments.map((segment, index) => {
        switch (segment.type) {
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

    const { streamedContent, functionCalls, functionResults } = useChatEventStream(prompt)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [streamedContent, functionCalls, functionResults]);

    const message = { type: "user", message: prompt, completed: true } as Message

    return (
        <div>
            <UserMessage message={message} />
            <FunctionResults calls={functionCalls} results={functionResults} />
            {streamedContent && <div className="flex w-full py-5 my-2">
                <Avatar />
                <div><StreamedContent streamedContent={streamedContent} /></div>
            </div>}
            <div ref={bottomRef} />
        </div>
    )
}


export default PromptAndResponse;
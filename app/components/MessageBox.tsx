import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import WandSpinner from "./WandSpinner";
import Image from "next/image"
import { useMessagesContext } from "../context/Context";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import React, { useMemo } from "react";

const friendlyNames = {
    "getETHBalance": "Get ETH Balance",
    "getPrices": "Get Prices",
    "swap": "Swap",
    "wrapWETH": "Wrap ETH",
    "unwrapWETH": "Unwrap WETH",
    "addLiquidity": "Add Liquidity",
    "removeLiquidityByIndex": "Remove Liquidity",
    "setAutonomousInstructions": "Set Autonomous Instructions",
    'highlight': 'Highlight',
    'swapDemo': 'Swap Demo',
    'addLiquidityDemo': 'Add Liquidity Demo',
    'setAutonomousInstructionsDemo': 'Set Autonomous Instructions Demo',
    "makeItRain": "Make it Rain",
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

const UserMessage = ({ index }: { index: number }) => {
    const { messages } = useMessagesContext();
    const message = messages[index];
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

interface FunctionCallMessage {
    name: keyof typeof friendlyNames;
    arguments?: string
    transactionHash?: string
}

const FunctionCall = ({ index }: { index: number }) => {
    const { messages } = useMessagesContext();
    const message = messages[index];

    const obj = useMemo(() => {
        return message.functionCall as unknown as FunctionCallMessage
    }, [message.functionCall]);

    const entries = useMemo(() => {
        return (
            obj?.arguments && Object.entries(obj.arguments).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-1">
                    <div className="w-1/3 text-right text-sm">{key}</div>
                    <div className="w-2/3 text-right text-sm">{value}</div>
                </div>
            ))
        )
    }, [obj])

    return (
        <Disclosure as="div" className="w-full py-5">
            <DisclosureButton className="group w-full text-left">
                <div className="flex flex-1 items-center mb-3 w-full pl-3">
                    <WandSpinner />
                    <div className={"flex flex-1 items-center italic"}>{friendlyNames[obj.name]}</div>
                    <ChevronDownIcon className="size-6 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                </div>
            </DisclosureButton>
            <div className="overflow-hidden py-2">
                <DisclosurePanel
                    transition
                    className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                >
                    {entries}
                </DisclosurePanel>
            </div>
        </Disclosure>
    );
}

const FunctionCallResult = ({ index }: { index: number }) => {
    const { messages } = useMessagesContext();
    const message = messages[index];

    const obj = message.functionCall as unknown as FunctionCallMessage;

    if (obj.transactionHash === undefined) return null

    const isDemo = obj.transactionHash === '0xdummytxhash'

    const handleTxLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDemo) {
            e.preventDefault();
            // Optionally alert or log for demo users
        }
    };

    return (
        <Disclosure as="div" className="w-full">
            <DisclosureButton className="group w-full text-left">
                <div className="flex flex-1 items-center mb-3 w-full">
                    <div className="flex flex-1 items-center italic justify-end">
                        <a href="https://basescan.org/tx/" target="_blank" onClick={handleTxLinkClick} className="flex text-sm items-center">View transaction on Basescan <ArrowTopRightOnSquareIcon className="size-5 ml-1 mr-5" /></a>
                    </div>
                    <ChevronDownIcon className="size-6 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                </div>
            </DisclosureButton>
            <div className="overflow-hidden py-2">
                <DisclosurePanel
                    transition
                    className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                >
                    {obj &&
                        Object.entries(obj).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-1"
                            >
                                <div className="w-1/3 text-right text-sm">{key}</div>
                                <div className="w-2/3 flex items-center justify-end gap-2">
                                    <span className="overflow-hidden text-ellipsis text-sm">{value}</span>
                                    {key === "transactionHash" && (
                                        <button
                                            onClick={() => navigator.clipboard.writeText(value)}
                                            className="ml-2 rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-400"
                                        >
                                            Copy
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </DisclosurePanel>
            </div>
        </Disclosure>
    );
}

const AssistantMessage = ({ index }: { index: number }) => {
    const { messages } = useMessagesContext();
    const message = messages[index];

    const memoizedImage = useMemo(() => (
        <div className="shrink-0 mr-2">
            <Image src="/images/hiro.png" height={32} width={32} alt="hiro" />
        </div>
    ), []);

    const segments = useMemo(() => parseMessage(message.message), [message.message]);

    const renderedSegments = useMemo(
        () =>
            segments.map((segment, index) => {
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
            }),
        [segments]
    );

    return (
        <div className="flex w-full py-5 my-2">
            {memoizedImage}
            <div>{renderedSegments}</div>
        </div>
    );
}

const MessageBox = ({ index }: { index: number }) => {
    const { messages } = useMessagesContext();
    const message = messages[index];

    const box = useMemo(() => {
        if (message.type === "user") return <UserMessage index={index} />
        if (message.type === "assistant" && message.functionCall === undefined) return <AssistantMessage index={index} />
        if (message.type === "function") return <FunctionCallResult index={index} />

        return <FunctionCall index={index} />
    }, [index, message.type, message.functionCall])

    return box

}

export default MessageBox;
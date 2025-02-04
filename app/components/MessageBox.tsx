import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import WandSpinner from "./WandSpinner";
import Image from "next/image"
import { Message } from "../context/Context";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";

const friendlyNames = {
    "getETHBalance": "Get ETH Balance",
    "swap": "Swap",
    "wrapWETH": "Wrap ETH",
    "unwrapWETH": "Unwrap WETH",
    "addLiquidity": "Add Liquidity",
    "setAutonomousInstructions": "Set Autonomous Instructions",
    'highlight': 'Highlight',
    'swapDemo': 'Swap Demo',
    'addLiquidityDemo': 'Add Liquidity Demo',
    'setAutonomousInstructionsDemo': 'Set Autonomous Instructions Demo',
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

interface FunctionCallMessage {
    name: keyof typeof friendlyNames;
    arguments?: string
    transactionHash?: string
}

const FunctionCall = ({ message }: { message: Message }) => {
    const obj = message.functionCall as unknown as FunctionCallMessage;
    return (
        <Disclosure as="div" className="w-full py-5">
            <DisclosureButton className="group w-full text-left">
                <div className="flex flex-1 items-center mb-3 w-full">
                    <WandSpinner />
                    <div className="flex flex-1 items-center italic">{friendlyNames[obj.name]}</div>
                    <ChevronDownIcon className="size-6 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                </div>
            </DisclosureButton>
            <div className="overflow-hidden py-2">
                <DisclosurePanel
                    transition
                    className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                >
                    {obj?.arguments && Object.entries(obj.arguments).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 grid-cols-max gap-2">
                            <div className="text-right">{key}</div>
                            <div className="text-right">{value}</div>
                        </div>
                    ))}
                </DisclosurePanel>
            </div>
        </Disclosure>
    );
}

const FunctionCallResult = ({ message }: { message: Message }) => {
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
                        <a href="https://basescan.org/tx/" target="_blank" onClick={handleTxLinkClick} className="flex items-center">View transaction on Basescan <ArrowTopRightOnSquareIcon className="size-5 ml-1 mr-5" /></a>
                    </div>
                    <ChevronDownIcon className="size-6 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                </div>
            </DisclosureButton>
            <div className="overflow-hidden py-2">
                <DisclosurePanel
                    transition
                    className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                >
                    {obj && Object.entries(obj).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 grid-cols-max gap-2">
                            <div className="text-right">{key}</div>
                            <div className="text-right overflow-hidden text-ellipsis">{value}</div>
                        </div>
                    ))}
                </DisclosurePanel>
            </div>
        </Disclosure>
    );
}

const AssistantMessage = ({ message }: { message: Message }) => {
    const segments = parseMessage(message.message)
    return (segments.length === 0) ? null : (

        <div className="flex w-full py-5 my-2">
            <div className="shrink-0 mr-2">
                <Image src="/images/hiro.png" height={32} width={32} alt="hiro" />
            </div>
            <div>{segments.map((segment, index) => {
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
            })}</div>
        </div>
    );
}

const MessageBox = ({ message }: { message: Message }) => {

    return message.type === "user" ? <UserMessage message={message} /> :
        message.type === "assistant" && message.functionCall === undefined ? <AssistantMessage message={message} /> :
            message.type === "function" ?
                <FunctionCallResult message={message} /> :
                <FunctionCall message={message} />
}

export default MessageBox;
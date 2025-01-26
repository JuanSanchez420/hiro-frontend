import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import WandSpinner from "./WandSpinner";
import Image from "next/image"

interface MessageProps {
    message: string
    type: "user" | "assistant" | "function"
}

const friendlyNames = {
    "getETHBalance": "Get ETH Balance",
    "swap": "Swap",
    "wrapETH": "Wrap ETH",
    "unwrapWETH": "Unwrap WETH",
    "addLiquidity": "Add Liquidity",
    "setAutonomousInstructions": "Set Autonomous Instructions",
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

const UserMessage = ({ message }: { message: string }) => {
    return (
        <div className="flex w-full justify-end my-2">
            <div className="rounded-full bg-gray-100 p-3">{message}</div>
        </div>

    );
}

interface FunctionCallMessage {
    name: keyof typeof friendlyNames;
    arguments: string
}

const FunctionCall = ({ message }: { message: string }) => {
    const obj: FunctionCallMessage = JSON.parse(message);
    obj.arguments = JSON.parse(obj.arguments) || {};
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

const FunctionCallResult = ({ message }: { message: string }) => {
    const obj: FunctionCallMessage = JSON.parse(message);
    obj.arguments = JSON.parse(obj.arguments) || {};
    return (
        <Disclosure as="div" className="w-full">
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

const AssistantMessage = ({ message }: { message: string }) => {
    const segments = parseMessage(message)
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

const Message = ({ message, type }: MessageProps) => {
    return type === "user" ? <UserMessage message={message} /> :
        type === "assistant" ? <AssistantMessage message={message} /> :
            <FunctionCall message={message} />;
}

export default Message;
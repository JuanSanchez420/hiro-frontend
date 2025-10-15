'use client'

import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { usePromptsContext } from "../context/PromptsContext";
import { useMessagesContext } from "../context/MessagesContext";
import Link from "next/link";
import Tooltip from "./Tooltip";

const NewChat = () => {
    const { resetPrompts } = usePromptsContext();
    const { resetMessages } = useMessagesContext();

    const handleNewChat = () => {
        fetch("/api/new-session")
        resetPrompts()
        resetMessages()
    }

    return (<div className="pr-4">
        <Tooltip content="New Chat" position="bottom">
            <Link href="/"><PencilSquareIcon className="size-6 text-gray-400 hover:cursor-pointer" onClick={handleNewChat} /></Link>
        </Tooltip>
    </div>)

}

export default NewChat;

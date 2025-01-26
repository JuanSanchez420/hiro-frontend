'use client'

import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { useMessagesContext } from "../context/Context";

const NewChat = () => {
    const { resetMessages } = useMessagesContext();
    
    const handleNewChat = () => {
        fetch("/api/reset")
        resetMessages()
    }

    return (<div className="pl-5">
        <PencilSquareIcon className="size-6 text-gray-400 hover:cursor-pointer" onClick={handleNewChat}/>
    </div>)

}

export default NewChat;
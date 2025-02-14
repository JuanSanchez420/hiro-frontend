'use client'

import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { usePromptsContext } from "../context/PromptsContext";

const NewChat = () => {
    const { resetPrompts } = usePromptsContext();
    
    const handleNewChat = () => {
        fetch("/api/reset")
        resetPrompts()
    }

    return (<div className="pl-5">
        <PencilSquareIcon className="size-6 text-gray-400 hover:cursor-pointer" onClick={handleNewChat}/>
    </div>)

}

export default NewChat;
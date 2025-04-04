'use client'

import { ChartBarIcon } from "@heroicons/react/24/outline"
import Link from "next/link";
import Tooltip from "./Tooltip";
import { useGlobalContext } from "../context/GlobalContext";

const NewChat = () => {
    const { setDrawerRightOpen } = useGlobalContext()

    const handleNewChat = () => {
        setDrawerRightOpen(true)
    }

    return (<div className="pr-6">
        <Tooltip content="Portfolio" position="bottom">
            <Link href="/"><ChartBarIcon className="size-6 text-gray-400 hover:cursor-pointer" onClick={handleNewChat} /></Link>
        </Tooltip>
    </div>)

}

export default NewChat;
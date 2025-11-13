'use client'

import { ChartBarIcon } from "@heroicons/react/24/outline"
import Link from "next/link";
import Tooltip from "./Tooltip";
import { useDrawerContext } from "../context/GlobalContext";

const NewChat = () => {
    const { setDrawerState } = useDrawerContext()

    const handleNewChat = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        setDrawerState({ isOpen: true, showRecommendations: false });
    }

    return (<div className="pr-6">
        <Tooltip content="Portfolio" position="bottom">
            <Link href="/"><ChartBarIcon className="size-6 text-gray-400 hover:cursor-pointer" onClick={handleNewChat} /></Link>
        </Tooltip>
    </div>)

}

export default NewChat;

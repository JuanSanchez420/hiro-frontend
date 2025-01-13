'use client'

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline"
import { useMessagesContext } from "../context/Context";

const DrawerButton = () => {
    const { setDrawerOpen } = useMessagesContext();
    return (
        <div className="ml-1 flex items-center">
            <ArrowRightStartOnRectangleIcon className="size-8 text-gray-400 hover:cursor-pointer" onClick={() => setDrawerOpen(true)} />
        </div>
    )
}

export default DrawerButton
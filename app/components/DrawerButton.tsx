'use client'

import { Bars3Icon } from "@heroicons/react/24/outline"
import { useGlobalContext } from "../context/GlobalContext";

const DrawerButton = () => {
    const { setDrawerLeftOpen } = useGlobalContext();
    return (
        <div className="ml-1 flex items-center">
            <Bars3Icon className="size-6 text-gray-400 hover:cursor-pointer" onClick={() => setDrawerLeftOpen(true)} />
        </div>
    )
}

export default DrawerButton
'use client'

import { Bars3Icon } from "@heroicons/react/24/outline"
import { useDrawerContext } from "../context/GlobalContext";

const DrawerButton = () => {
    const { drawerState, setDrawerState } = useDrawerContext();

    return (
        <div className="ml-1 flex items-center">
            <Bars3Icon className="size-6 text-gray-400 hover:cursor-pointer" onClick={() => {
                setDrawerState({ ...drawerState, isOpen: true });
            }} />
        </div>
    )
}

export default DrawerButton

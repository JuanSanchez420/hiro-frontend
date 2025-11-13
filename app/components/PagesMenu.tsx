'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { BookOpenIcon } from "@heroicons/react/24/outline"
import { useThemeContext } from "../context/GlobalContext"
import Link from "next/link"
import Tooltip from "./Tooltip"

const PagesMenu = () => {
    const { styles, theme } = useThemeContext()
    const itemClass = theme === 'light'
        ? "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
        : "block px-4 py-2 text-sm text-gray-300 data-[focus]:bg-gray-800 data-[focus]:outline-none"

    return (
        <div className="pr-4">
            <Menu as="div" className="relative">
                <Tooltip content="Pages" position="bottom">
                    <MenuButton>
                        <BookOpenIcon className="size-6 text-gray-400 hover:cursor-pointer" aria-hidden="true" />
                        <span className="sr-only">Pages menu</span>
                    </MenuButton>
                </Tooltip>
                <MenuItems
                    transition
                    className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ${styles.background}`}
                >
                    <MenuItem>
                        <Link href="/faq" className={itemClass}>
                            FAQ
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/tradingview-indicator" className={itemClass}>
                            TradingView Indicator
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/feature-request" className={itemClass}>
                            Feature Request
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/about" className={itemClass}>
                            About
                        </Link>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    )
}

export default PagesMenu

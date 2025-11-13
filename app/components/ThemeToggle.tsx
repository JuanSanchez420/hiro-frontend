'use client'

import { Switch } from '@headlessui/react'
import { useThemeContext } from '../context/GlobalContext'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
    const { theme, setTheme } = useThemeContext()

    return (
        <Switch
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 data-[checked]:bg-emerald-600"
        >
            <span className="sr-only">Use setting</span>
            <span className="pointer-events-none relative inline-block size-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5">
                <span
                    aria-hidden="true"
                    className="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in group-data-[checked]:opacity-0 group-data-[checked]:duration-100 group-data-[checked]:ease-out"
                >
                    <SunIcon className='size-5' />
                </span>
                <span
                    aria-hidden="true"
                    className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-[checked]:opacity-100 group-data-[checked]:duration-200 group-data-[checked]:ease-in"
                >
                    <MoonIcon className='size-5' />
                </span>
            </span>
        </Switch>
    )
}

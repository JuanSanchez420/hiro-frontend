'use client'
import { useState, useEffect, useRef } from "react";
import { usePromptsContext } from "../context/PromptsContext";
import { usePathname } from "next/navigation";
import Widget from "./widgets/Widget";
import ArrowUpCircleIcon from "@heroicons/react/24/outline/ArrowUpCircleIcon";
import { ArrowDownTrayIcon, ArrowsRightLeftIcon, ArrowUpTrayIcon, CpuChipIcon, CurrencyDollarIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useGlobalContext } from "../context/GlobalContext";
import { WidgetOption } from '../types';

const tabs = [
    { name: 'Swap', icon: <ArrowsRightLeftIcon className="size-5 mr-2" /> },
    { name: 'Earn', icon: <CurrencyDollarIcon className="size-5 mr-2" /> },
    { name: 'Lend', icon: <ArrowUpTrayIcon className="size-5 mr-2" /> },
    { name: 'Borrow', icon: <ArrowDownTrayIcon className="size-5 mr-2" />   },
    { name: 'Autonomous', icon: <CpuChipIcon className="size-5 mr-2" /> },
]

const PromptInput = (

) => {
  const { addPrompt } = usePromptsContext();
  const { styles, setWidget, setDrawerLeftOpen } = useGlobalContext()
  const [value, setValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  const submit = () => {
    if (value.trim() === "") return
    addPrompt(value);
    setValue("");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit()
    }
  }

  const handleWidgetSelect = (widgetName: WidgetOption) => {
    setWidget(widgetName);
    setIsDropdownOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (path !== '/') return null;

  return (
    <div className="min-w-0 flex-1">
      <Widget />
      <form action="#" className="relative mb-2">
        <div className={`rounded-lg outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600 ${styles.background} ${styles.text}`}>
          <label htmlFor="comment" className="sr-only">
            Message Hiro
          </label>
          <div className="flex flex-col">
            <textarea
              id="comment"
              name="comment"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="Message Hiro"
              autoComplete="off"
              className={`block w-full resize-none bg-transparent px-3 py-1.5 text-base placeholder:text-gray-400 focus:outline-none sm:text-sm/6`}
            />

            {/* Bottom row with 3 icons */}
            <div className="flex justify-between items-center px-3 pb-2">
              <div className="flex items-center gap-3">
                {/* Widget selector */}
                <div className="relative" ref={menuRef}>
                  <button
                    className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <PlusIcon className="size-6" aria-hidden="true" />
                  </button>

                  {isDropdownOpen && (
                    <div className={`absolute left-0 z-10 mb-2 bottom-full w-48 origin-bottom-left rounded-md shadow-lg ring-1 ring-black/5 ${styles.background} ${styles.text}`}>
                      <div className="py-1">
                        {tabs.map((tab) => (
                          <button
                            key={tab.name}
                            onClick={() => handleWidgetSelect(tab.name as WidgetOption)}
                            className={`group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900 ${styles.text}`}
                          >
                            {tab.icon}
                            {tab.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Portfolio button */}
                <button
                  className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  onClick={() => setDrawerLeftOpen(true)}
                >
                  <ChartBarIcon className="size-6" aria-hidden="true" />
                </button>
              </div>

              {/* Submit button */}
              <ArrowUpCircleIcon className="size-8 text-gray-400 hover:cursor-pointer hover:text-gray-600" onClick={submit} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PromptInput;
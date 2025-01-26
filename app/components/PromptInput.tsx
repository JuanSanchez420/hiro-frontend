'use client'
import { useState } from "react";
import { useMessagesContext } from "../context/Context";
import { Listbox, Label, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { widgetOptions } from "./widgets/widgetOptions";
import { usePathname } from "next/navigation";
import Widget from "./widgets/Widget";
import { styles } from "../utils/styles";
import Link from "next/link";

const PromptInput = (

) => {
  const { addMessage, widget, setWidget } = useMessagesContext();
  const [value, setValue] = useState("");
  const path = usePathname();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMessage(value, "user", true);
      setValue("");
    }
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  if (path !== '/') return null;

  return (
    <div className="min-w-0 flex-1">
      <Widget />
      <form action="#" className="relative">
        <div className="rounded-lg bg-white outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600">
          <label htmlFor="comment" className="sr-only">
            Message Hiro
          </label>
          <textarea
            id="comment"
            name="comment"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Message Hiro"
            autoComplete="off"
            className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
          />

          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true" className="py-2">
            {/* Matches height of button in toolbar (1px border + 36px content height) */}
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <Listbox value={widget} onChange={setWidget}>
                <Label className="sr-only">Your mood</Label>
                <div className="relative">
                  <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                    <span className="flex items-center justify-center">
                      {widget.value === null ? (
                        <span>
                          <ChatBubbleLeftEllipsisIcon aria-hidden="true" className="size-10 shrink-0 ml-2" />
                          <span className="sr-only">Choose an action</span>
                        </span>
                      ) : (
                        <span>
                          <span
                            className={classNames(
                              widget.bgColor,
                              'flex size-8 items-center justify-center rounded-full',
                            )}
                          >
                            <widget.icon aria-hidden="true" className="size-5 shrink-0 text-white" />
                          </span>
                          <span className="sr-only">{widget.name}</span>
                        </span>
                      )}
                    </span>
                  </ListboxButton>

                  <ListboxOptions
                    transition
                    className="absolute z-10 -ml-6 bottom-0 w-60 rounded-lg bg-white py-3 text-base shadow outline outline-1 outline-black/5 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:ml-auto sm:w-64 sm:text-sm"
                  >
                    {widgetOptions.map((mood) => (
                      <ListboxOption
                        key={mood.value}
                        value={mood}
                        className="cursor-pointer select-none bg-white px-3 py-2 data-[focus]:relative data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        <div className="flex items-center">
                          <div
                            className={classNames(
                              mood.bgColor,
                              'flex size-8 items-center justify-center rounded-full',
                            )}
                          >
                            <mood.icon aria-hidden="true" className={classNames(mood.iconColor, 'size-5 shrink-0')} />
                          </div>
                          <span className="ml-3 block truncate font-medium">{mood.name}</span>
                        </div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 m-1">
          <Link href="/portfolio"><button className={styles.button}>Portfolio</button></Link>
        </div>
      </form>
    </div>
  )
}

export default PromptInput;
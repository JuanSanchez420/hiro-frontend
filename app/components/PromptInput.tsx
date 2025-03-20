'use client'
import { useState } from "react";
import { usePromptsContext } from "../context/PromptsContext";
import { usePathname } from "next/navigation";
import Widget from "./widgets/Widget";
import Tabs from "./Tabs";
import ArrowUpCircleIcon from "@heroicons/react/24/outline/ArrowUpCircleIcon";
import { useGlobalContext } from "../context/GlobalContext";

const PromptInput = (

) => {
  const { addPrompt } = usePromptsContext();
  const { styles } = useGlobalContext()
  const [value, setValue] = useState("");
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

  if (path !== '/') return null;

  return (
    <div className="min-w-0 flex-1">
      <Widget />
      <Tabs />
      <form action="#" className="relative mb-2">
        <div className={`rounded-lg outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600 ${styles.background} ${styles.text}`}>
          <label htmlFor="comment" className="sr-only">
            Message Hiro
          </label>
          <div className="flex">
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
            <div className="flex-shrink-0 flex items-center p-2">
              <ArrowUpCircleIcon className="size-10 text-gray-400 hover:cursor-pointer" onClick={submit} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PromptInput;
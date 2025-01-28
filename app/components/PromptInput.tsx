'use client'
import { useState } from "react";
import { useMessagesContext } from "../context/Context";
import { usePathname } from "next/navigation";
import Widget from "./widgets/Widget";
import Tabs from "./Tabs";

const PromptInput = (

) => {
  const { addMessage } = useMessagesContext();
  const [value, setValue] = useState("");
  const path = usePathname();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMessage(value, "user", true);
      setValue("");
    }
  }

  if (path !== '/') return null;

  return (
    <div className="min-w-0 flex-1">
      <Widget />
      <Tabs />
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
            rows={3}
            placeholder="Message Hiro"
            autoComplete="off"
            className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
          />
        </div>
      </form>
    </div>
  )
}

export default PromptInput;
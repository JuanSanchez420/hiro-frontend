'use client'

import { useCallback, useEffect, useMemo, useRef } from "react";
import MessageBox from "./components/MessageBox";
import { useMessagesContext } from "./context/Context";
import useChatEventStream from "./hooks/useChatEventStream";
import Image from 'next/image'
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { styles } from "./utils/styles";
import Confirm from "./components/Confirm";
import InterestingButton from "./components/InterestingButton";

export default function Home() {
  const { messages, widget, addMessage } = useMessagesContext();
  useChatEventStream()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, widget]);

  const Intro = useCallback(() => {
    return (<div className="flex flex-col">
      <div className="flex">
        <Image src="/images/hiro.png" alt="Hiro" width={32} height={32} />
        <h1 className="bold text-2xl ml-4">Hi, I&apos;m Hiro!</h1>
      </div>
      <div className="flex justify-evenly mt-20">
        <div><button className={`flex ${styles.button}`} onClick={() => addMessage(`what can you do?`, "user", true)}><GlobeAltIcon className="size-5 mr-2" />What can you do?</button></div>
        <div><InterestingButton /></div>
      </div>
    </div>)
  }, [addMessage])

  const Content = () => {
    const boxes = useMemo(() => {
      return Array.from({ length: messages.length }, (_e, index: number) => (
        <MessageBox key={index} index={index} />
      ));
    }, [])

    return (<section className="message-list">
      {boxes}
      <Confirm />
    </section>)
  }

  return (<div className={`flex flex-col h-full`}>
    {messages.length === 0 ? <Intro /> : <Content />}
    <div ref={bottomRef} />
  </div>

  );
}

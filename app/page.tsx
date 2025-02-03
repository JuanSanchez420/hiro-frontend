'use client'

import { useCallback, useEffect, useRef } from "react";
import MessageBox from "./components/MessageBox";
import { Message, useMessagesContext } from "./context/Context";
import useSession from "./hooks/useSession";
import useChatEventStream from "./hooks/useChatEventStream";
import Image from 'next/image'
import { ArrowPathIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { styles } from "./utils/styles";

export default function Home() {
  const { messages, widget, addMessage } = useMessagesContext();
  useSession()
  useChatEventStream()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, widget]);

  const Intro = useCallback(() => {
    return (<div className="flex flex-col">
      <div className="flex">
        <Image src="/images/hiro-large.png" alt="Hiro" width={32} height={32} />
        <h1 className="bold text-2xl ml-4">Hi, I&apos;m Hiro!</h1>
      </div>
      <div className="flex justify-evenly mt-20">
        <div><button className={`flex ${styles.button}`} onClick={() => addMessage(`i'd like a tour`, "user", true)}><GlobeAltIcon className="size-5 mr-2" />Take a quick tour</button></div>
        <div><button className={`flex ${styles.button}`} onClick={() => addMessage('do a barrel roll!', "user", true)}><ArrowPathIcon className="size-5 mr-2" />Do a barrel roll</button></div>
      </div>
    </div>)
  }, [addMessage])

  const Content = () => {
    return (<section className="message-list">
      {messages.map((m: Message, index: number) => (
        <MessageBox key={index} message={m} />
      ))}
    </section>)
  }

  return (<div className="flex flex-col h-full">
    {messages.length === 0 ? <Intro /> : <Content />}
    <div ref={bottomRef} />
  </div>

  );
}

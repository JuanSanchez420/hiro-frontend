'use client'

import { useCallback, useEffect, useRef } from "react";
import MessageBox from "./components/MessageBox";
import { Message, useMessagesContext } from "./context/Context";
import TypingEffect from "./components/TypingEffect";
import useSession from "./hooks/useSession";
import useChatEventStream from "./hooks/useChatEventStream";
import Image from 'next/image'
import { styles } from "./utils/styles";

export default function Home() {
  const { messages, widget } = useMessagesContext();
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
      <div className="py-5">
        <TypingEffect
          text="I&apos;m an AI agent here to help you with crypto. I can swap, stake, and even run transactions while you sleep! I'm in demo mode right now, so click around try anthing you want."
          speed={10} />
      </div>
      <div className="flex justify-evenly">
        <button className={styles.button}>What can you do?</button>
      </div>
    </div>)
  }, [])

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

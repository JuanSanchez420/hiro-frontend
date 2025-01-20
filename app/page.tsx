'use client'

import { useCallback, useEffect, useRef } from "react";
import MessageBox from "./components/MessageBox";
import { Message, useMessagesContext } from "./context/Context";
import TypingEffect from "./components/TypingEffect";
import Widget from "./components/widgets/Widget";
import useSession from "./hooks/useSession";
import useChatEventStream from "./hooks/useChatEventStream";
import Image from 'next/image'

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
          text="I&apos;m an AI assistant here to help you with crypto. If you connect your wallet, I&apos;ll be able to provide personalized advice and even carry out transactions."
          speed={10} />
      </div>
    </div>)
  }, [])

  const Content = () => {
    return (<section className="message-list">
      {messages.map((m: Message, index: number) => (
        <MessageBox key={index} message={m.message} type={m.type} />
      ))}
    </section>)
  }

  return (<div className="flex flex-col h-full">
    {messages.length === 0 ? <Intro /> : <Content />}
    <Widget />
    <div ref={bottomRef} />
  </div>

  );
}

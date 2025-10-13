'use client'

import { useCallback, useEffect } from "react";
import { useAccount } from 'wagmi';
import { PromptAndResponse, HistoricalConversation } from "./components/MessageBox";
import Image from 'next/image'
import { usePromptsContext } from "./context/PromptsContext";
import React from "react";
import { useMessagesContext } from "./context/MessagesContext";
import { useGlobalContext } from "./context/GlobalContext";

interface ContentProps { prompts: string[]; }

const Content = React.memo(function Content({ prompts }: ContentProps) {

  return (<section className="message-list"> {prompts.map((p: string, index: number) => (<PromptAndResponse key={index} prompt={p} />))} </section>);
});

export default function Home() {
  const { prompts } = usePromptsContext();
  const { messages, loadMessages, loading } = useMessagesContext();
  const { isConnected } = useAccount();
  const { isSignedIn } = useGlobalContext();

  useEffect(() => {
    if (!isConnected || !isSignedIn) {
      return;
    }

    loadMessages();
  }, [isConnected, isSignedIn, loadMessages]);

  const hasHistory = !loading && Array.isArray(messages) && messages.length > 0;

  const Intro = useCallback(() => {
    return (<div className="flex flex-col">
      <div className="flex">
        <Image src="/images/hiro.png" alt="Hiro" width={32} height={32} />
        <h1 className="font-bold text-2xl ml-4">Hi, I&apos;m Hiro!</h1>
      </div>
      <div className="mt-5">I make crypto safe, easy, and profitable. I work while you sleep.</div>
      <div className="mt-8"><span className="font-bold italic">Swap</span>: No approvals headache. Only safe tokens. Set buy and take-profit orders.</div>
      <div className="mt-3"><span className="font-bold italic">Earn</span>: Provide and manage liquidity to earn passive yield.</div>
      <div className="mt-3"><span className="font-bold italic">Lend</span>: Earn interest on your tokens without price divergence risk.</div>
      <div className="mt-3"><span className="font-bold italic">Borrow</span>: Take long or short positions instantly.</div>
      <div className="mt-3"><span className="font-bold italic">Autonomous</span>: Leave instructions and I&apos;ll take care of things while you&apos;re away.</div>
    </div>)
  }, [])

  return (<div className={`flex flex-col h-full`}>
    {prompts.length === 0
      ? (hasHistory ? <HistoricalConversation messages={messages} /> : <Intro />)
      : <Content prompts={prompts} />}
  </div>

  );
}

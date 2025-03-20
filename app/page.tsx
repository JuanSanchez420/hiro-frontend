'use client'

import { useCallback } from "react";
import { PromptAndResponse } from "./components/MessageBox";
import Image from 'next/image'
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Confirm from "./components/Confirm";
import InterestingButton from "./components/InterestingButton";
import { usePromptsContext } from "./context/PromptsContext";
import React from "react";
import { useGlobalContext } from "./context/GlobalContext";

interface ContentProps { prompts: string[]; }

const Content = React.memo(function Content({ prompts }: ContentProps) {

  return (<section className="message-list"> {prompts.map((p: string, index: number) => (<PromptAndResponse key={index} prompt={p} />))} <Confirm /> </section>);
});

export default function Home() {
  const { styles } = useGlobalContext()
  const { prompts, addPrompt } = usePromptsContext();

  const Intro = useCallback(() => {
    return (<div className="flex flex-col">
      <div className="flex">
        <Image src="/images/hiro.png" alt="Hiro" width={32} height={32} />
        <h1 className="bold text-2xl ml-4">Hi, I&apos;m Hiro!</h1>
      </div>
      <div className="mt-3">I&apos;m in demo mode right now so you can play around with everything.</div>
      <div className="mt-3">The goal is to show off the interface before release!</div>
      <div className="flex justify-evenly mt-20">
        <div><button className={`flex ${styles.button}`} onClick={() => addPrompt('what can you do?')}><GlobeAltIcon className="size-5 mr-2" />What can you do?</button></div>
        <div><InterestingButton /></div>
      </div>
    </div>)
  }, [addPrompt, styles])

  return (<div className={`flex flex-col h-full`}>
    {prompts.length === 0 ? <Intro /> : <Content prompts={prompts} />}
  </div>

  );
}

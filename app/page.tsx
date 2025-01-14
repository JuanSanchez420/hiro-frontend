'use client'

import { useCallback, useEffect } from "react";
import MessageBox from "./components/MessageBox";
import { Message, useMessagesContext } from "./context/Context";
import { fetchChatStream } from "./utils/fetchChatStream";
import TypingEffect from "./components/TypingEffect";
import chatEventStream from "./utils/chatEventStream";
import Widget from "./components/widgets/Widget";
import usePortfolio from "./hooks/usePortfolio";
import useSession from "./hooks/useSession";

export default function Home() {
  const { messages, addChunk } = useMessagesContext();
  useSession()

  const handleFetchChat = async (): Promise<void> => {
    addChunk("", "start");
    await fetchChatStream(`/api/stream?content=${messages[messages.length - 1]?.message}`, (chunk) => {
      addChunk(chunk, "middle");
    });
    addChunk("", "end");
  };

  const handleChatEvent = async (): Promise<void> => {
    addChunk("", "start");

    const eventSource = chatEventStream(
      `/api/stream?content=${messages[messages.length - 1]?.message}`,
      (chunk) => {
        addChunk(chunk, "middle");
      },
    );

    // TODO: no way this works
    addChunk("", "end");
  }


    useEffect(() => {
      if (messages.length > 0 && messages[messages.length - 1].completed && messages[messages.length - 1].type === "user") // handleFetchChat();
        handleChatEvent()
    }, [messages])


    const Intro = useCallback(() => {
      return (<div className="flex flex-col">
        <div className="flex">
          <img src="/images/hiro.png" alt="Hiro" className="size-8" />
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
    </div>

    );
  }

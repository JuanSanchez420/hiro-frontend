// useChatEventStream.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useMessagesContext } from "../context/MessagesContext";
import useDoABarrelRoll from "./useDoABarrelRoll";
import usePortfolio from "./usePortfolio";
import doConfettiBurst from "../utils/doConfettiBurst";
import { useGlobalContext } from "../context/GlobalContext";
import { useAccount } from "wagmi";

const useChatEventStream = () => {
  const { messages, addMessage } = useMessagesContext();
  const { triggerHighlight, setShowConfirm, setRain } = useGlobalContext();
  const { fetchPortfolio } = usePortfolio();
  const doABarrelRoll = useDoABarrelRoll();
  const account = useAccount();
  const isStreaming = useRef(false);

  // Use state for visual updates.
  const [streamedContent, setStreamedContent] = useState("");
  // Also track the latest content in a ref to avoid stale closures.
  const streamedContentRef = useRef("");
  const prevMessagesCount = useRef<number>(0)

  useEffect(() => {
    // Ensure the ref is always up-to-date.
    streamedContentRef.current = streamedContent;
  }, [streamedContent]);

  const isPrompt = messages.length > 0 && messages[messages.length - 1].type === "user";

  const handleChatEvent = useCallback((prompt: string) => {
    const eventSource = new EventSource(
      `/api/stream?content=${prompt}${account?.isConnected ? "" : `&demo=true`}`
    );

    eventSource.addEventListener("functionCall", (event: MessageEvent) => {
      const obj = JSON.parse(event.data);
      obj.arguments = obj.arguments ? JSON.parse(obj.arguments) : {};
      console.log("functionCall:", obj);
      if (obj.name === "highlight") {
        triggerHighlight(obj.arguments.section);
        return;
      }
      if (obj.name === "confettiBurst") {
        doConfettiBurst();
        return;
      }
      if (obj.name === "doABarrelRoll") {
        doABarrelRoll();
        return;
      }
      if (obj.name === "makeItRain") {
        setRain(obj.arguments.symbol);
      }
      if (obj.name === "confirm") {
        setShowConfirm(true);
        return;
      }
      addMessage("", "assistant", true, obj);
    });

    eventSource.addEventListener("functionCallResult", (event: MessageEvent) => {
      const obj = JSON.parse(event.data);
      console.log("functionCallResult:", obj);
      if (obj.section) return;
      if (obj.transactionHash) {
        fetchPortfolio();
      }
      addMessage("", "function", true, obj);
    });

    eventSource.addEventListener("open", () => {
      isStreaming.current = true;
      setStreamedContent("");
      streamedContentRef.current = "";
    });

    eventSource.onmessage = (event) => {
      const chunk: string = JSON.parse(event.data);
      setStreamedContent((prev) => {
        const newContent = prev + chunk;
        streamedContentRef.current = newContent;
        return newContent;
      });
    };

    eventSource.addEventListener("end", () => {
      if (isStreaming.current) {
        isStreaming.current = false;
        addMessage(streamedContentRef.current, "assistant", true);
        setStreamedContent("");
        eventSource.close();
      }
    });

    eventSource.onerror = (err: Event) => {
      console.error("EventSource error:", err);
      eventSource.close();
    };

    // Clean up when the effect is unmounted.
    return () => {
      eventSource.close();
    };
  }, [
    account,
    addMessage,
    doABarrelRoll,
    fetchPortfolio,
    setRain,
    setShowConfirm,
    triggerHighlight,
  ]);

  useEffect(() => {
    if (isPrompt && prevMessagesCount.current < messages.length) {
      prevMessagesCount.current = messages.length;
      handleChatEvent(messages[messages.length - 1].message);
    }
  }, [messages, isPrompt, handleChatEvent]);

  // Return the state so consuming components update visually with each chunk.
  return streamedContent;
};

export default useChatEventStream;
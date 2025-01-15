// useChatEventStream.ts
import { useCallback, useEffect } from "react";
import { useMessagesContext } from "../context/Context";

const useChatEventStream = () => {
  const { messages, addChunk } = useMessagesContext();

  const handleChatEvent = useCallback(() => {
    const eventSource = new EventSource(`/api/stream?content=${messages[messages.length - 1]?.message}`);

    eventSource.onmessage = (event) => {
      const chunk = JSON.parse(event.data);
      addChunk(chunk, "middle");
    };

    eventSource.addEventListener('open', () => addChunk("", "start"))
    eventSource.addEventListener('end', () => {
      addChunk("", "end")
      eventSource.close()
    })
    eventSource.onerror = (err: Event) => {
      console.error('EventSource error:', err);
      eventSource.close();
    }
  }, [addChunk, messages])

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].completed && messages[messages.length - 1].type === "user")
      handleChatEvent()
  }, [messages, handleChatEvent])

};

export default useChatEventStream;
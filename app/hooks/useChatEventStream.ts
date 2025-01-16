// useChatEventStream.ts
import { useCallback, useEffect } from "react";
import { useMessagesContext } from "../context/Context";

const useChatEventStream = () => {
  const { messages, addChunk, addMessage } = useMessagesContext();

  const handleChatEvent = useCallback(() => {
    const eventSource = new EventSource(`/api/stream?content=${messages[messages.length - 1]?.message}`);

    eventSource.onmessage = (event) => {
      const chunk = JSON.parse(event.data);
      addChunk(chunk, "middle");
    }

    eventSource.addEventListener('functionCall', (event: MessageEvent) => {
      // event.data will be an object
      const entries = Object.entries(JSON.parse(event.data));
      let functionCall = ""
      for(const [key, value] of entries) {
        functionCall += `${key}: ${value}\n`
      }
      addMessage(functionCall, "function", true)
      console.log("Function call:", JSON.parse(event.data))
    })

    eventSource.addEventListener('functionCallResult', (event: MessageEvent) => {
      // event.data will be an object
      const entries = Object.entries(JSON.parse(event.data));
      let functionCallResult = ""
      for(const [key, value] of entries) {
        functionCallResult += `${key}: ${value}\n`
      }
      addMessage(functionCallResult, "assistant", true)
      console.log("Function call result:", JSON.parse(event.data))
    })

    eventSource.addEventListener('open', () => addChunk("", "start"))
    eventSource.addEventListener('end', () => {
      addChunk("", "end")
      eventSource.close()
    })
    eventSource.onerror = (err: Event) => {
      console.error('EventSource error:', err);
      eventSource.close();
    }
  }, [addChunk, messages, addMessage])

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].completed && messages[messages.length - 1].type === "user")
      handleChatEvent()
  }, [messages, handleChatEvent])

};

export default useChatEventStream;
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
      // event.data will be an object { role: "assistant", content: null, function_call: functionCall }
      const obj = JSON.parse(event.data)
      obj.arguments = obj.arguments ? JSON.parse(obj.arguments) : {}
      addMessage("", "assistant", true, obj)
    })

    eventSource.addEventListener('functionCallResult', (event: MessageEvent) => {
      // event.data will be an object { role: "function", name: `${currentFunctionCall}`, content: result }
      // addMessage(event.data, "function", true)
      const obj = JSON.parse(event.data)

      /*
        swap obj: {"amount0":-1,"amount1":0.9350678712419804,"transactionHash":"0x89bc843fade18dfa522c185f8f63916aefc21d93ffddea7398b5586ed72c9311"}
      */
      addMessage("", "function", true, obj)
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
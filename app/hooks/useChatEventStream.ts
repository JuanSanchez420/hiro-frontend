// useChatEventStream.ts
import { useCallback, useEffect } from "react";
import { useMessagesContext } from "../context/Context";
import { useAccount } from "wagmi";
import createConfettiBurst from "../utils/createConfettiBurst";
import useDoABarrelRoll from "./useDoABarrelRoll";

const useChatEventStream = () => {
  const { messages, addChunk, addMessage, triggerHighlight } = useMessagesContext();
  const account = useAccount()
  const doABarrelRoll = useDoABarrelRoll()

  const handleChatEvent = useCallback(() => {
    const eventSource = new EventSource(`/api/stream?content=${messages[messages.length - 1]?.message}${account?.isConnected ? "" : `&demo=true`}`);

    eventSource.onmessage = (event) => {
      const chunk = JSON.parse(event.data);
      addChunk(chunk, "middle");
    }

    eventSource.addEventListener('functionCall', (event: MessageEvent) => {
      // event.data will be an object { role: "assistant", content: null, function_call: functionCall }
      const obj = JSON.parse(event.data)
      obj.arguments = obj.arguments ? JSON.parse(obj.arguments) : {}
console.log('functionCall:', obj)
      if (obj.name === "highlight") {
        triggerHighlight(obj.arguments.section)
        return
      }
      if (obj.name === "confettiBurst") {
        createConfettiBurst();
        return
      }
      if(obj.name === "doABarrelRoll") {
        doABarrelRoll();
        return
      }
      addMessage("", "assistant", true, obj)
    })

    eventSource.addEventListener('functionCallResult', (event: MessageEvent) => {
      // event.data will be an object { role: "function", name: `${currentFunctionCall}`, content: result }
      // addMessage(event.data, "function", true)
      const obj = JSON.parse(event.data)
console.log('functionCallResult:', obj)
      /*
        swap obj: {"amount0":-1,"amount1":0.9350678712419804,"transactionHash":"0x89bc843fade18dfa522c185f8f63916aefc21d93ffddea7398b5586ed72c9311"}
      */

      // don't throw a message for highlight
      if (obj.section) return
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
  }, [addChunk, messages, addMessage, account, triggerHighlight])

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].completed && messages[messages.length - 1].type === "user")
      handleChatEvent()
  }, [messages, handleChatEvent])

};

export default useChatEventStream;
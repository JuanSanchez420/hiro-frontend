import { useMessagesContext } from "@/app/context/Context";
import { styles } from "@/app/utils/styles";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";


const AutonomousInstructions = () => {
  const account = useAccount()
  const { addMessage, setWidget } = useMessagesContext();
  const [value, setValue] = useState("");

  useEffect(() => {
    const f = async () => {
      const i = await fetch(`/api/instructions?account=${account.address}`, { credentials: 'include', });
      const j = await i.json();
      setValue(j.instructions)
    }
    f()
  }, [account.address])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMessage(`Set autonomous instructions: ${value}. Please ask if I was unclear on anything.`, "user", true);
      setValue("");
      setWidget(null)
    }
  }

  const clearInstructions = () => {
    addMessage(`Clear autonomous instructions.`, "user", true);
    setValue("");
    setWidget(null)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Autonomous Instructions</h2>
      <ul className="mb-5">
        <li>Be clear.</li>
        <li>Shorter is better.</li>
        <li>Specify tokens and amounts.</li>
        <li>Hiro will run these instructions every hour.</li>
      </ul>
      <div>
        <div className="flex justify-between">
          <h3 className="text-sm font-semibold mb-1">Current Instructions</h3>
          <button className={styles.buttonSm} onClick={clearInstructions}>Clear</button>
        </div>
        <p className="text-sm text-gray-500">None</p>
      </div>
      <textarea
        id="instructions"
        name="instructions"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="Give instructions for Hiro."
        autoComplete="off"
        className="block w-full mt-3 border-t resize-none bg-transparent px-1 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
      />
    </div>
  );
}

export default AutonomousInstructions;

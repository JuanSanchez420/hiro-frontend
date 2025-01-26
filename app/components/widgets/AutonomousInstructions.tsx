import { useMessagesContext } from "@/app/context/Context";
import { useState } from "react";


const AutonomousInstructions = () => {
    const { addMessage } = useMessagesContext();
    const [value, setValue] = useState("");
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addMessage(`Set autonomous instructions: ${value}. Please ask if I was unclear on anything.`, "user", true);
          setValue("");
        }
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
        <textarea
            id="instructions"
            name="instructions"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Give instructions for Hiro."
            autoComplete="off"
            className="block w-full border-t resize-none bg-transparent px-1 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
          />
        </div>
    );
    }

export default AutonomousInstructions;

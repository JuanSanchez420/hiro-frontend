import { useThemeContext, useWidgetContext } from "@/app/context/GlobalContext";
import { usePromptsContext } from "@/app/context/PromptsContext";
import { useEffect, useState } from "react";


const AutonomousInstructions = () => {
  const { addPrompt } = usePromptsContext();
  const { setWidget } = useWidgetContext();
  const { styles } = useThemeContext();
  const [value, setValue] = useState("");
  const [interval, setInterval] = useState('daily')

  const intervals = [
    { id: 'hourly', title: 'Hourly' },
    { id: 'daily', title: 'Daily' },
    { id: 'weekly', title: 'Weekly' },
  ]

  useEffect(() => {
    const f = async () => {
      const i = await fetch(`/api/instructions`, { credentials: 'include', });
      const j = await i.json();
      setValue(j.instructions)
    }
    f()
  }, [])

  const doPrompt = () => {
    addPrompt(`Set autonomous instructions: ${value}. I want these to run ${interval}. Please ask if I was unclear on anything.`);
    setValue("");
    setWidget(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doPrompt();
    }
  }

  const clearInstructions = () => {
    addPrompt(`Clear autonomous instructions.`);
    setValue("");
    setWidget(null)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Autonomous Instructions</h2>
      <textarea
        id="instructions"
        name="instructions"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="Give instructions for Hiro."
        autoComplete="off"
        className="block w-full my-3 border resize-none bg-transparent px-1 py-1.5 text-base placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
      />
      <div className="flex w-full mb-3">
        <fieldset>
          <legend className="text-sm/6 font-semibold">Run these instructions:</legend>
          <div className="space-y-0 sm:flex sm:items-center sm:space-x-4">
            {intervals.map((i) => (
              <div key={i.id} className="flex items-center">
                <input
                  checked={interval === i.id}
                  id={i.id}
                  name="notification-method"
                  type="radio"
                  onChange={() => setInterval(i.id)}
                  className="relative size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-emerald-600 checked:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <label htmlFor={i.id} className="ml-3 block text-sm/6">
                  {i.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <ul className="mb-5 text-sm">
        <li>Be clear.</li>
        <li>Shorter is better.</li>
        <li>Specify tokens and amounts.</li>
      </ul>
      <div className="w-full flex">
        <button className={`w-full mr-1 bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1`} disabled={value === ""} onClick={doPrompt}>Save</button>
        <button className={`${styles.button} w-full`} onClick={clearInstructions}>Clear</button>
      </div>
    </div>
  );
}

export default AutonomousInstructions;

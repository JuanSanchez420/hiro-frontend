import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { usePromptsContext } from "../context/PromptsContext";
import { useGlobalContext } from "../context/GlobalContext";
import Image from 'next/image'

const rand = (max: number) => Math.floor(Math.random() * max)

const InterestingButton = () => {
    const { styles, theme } = useGlobalContext()
    const { addPrompt } = usePromptsContext();
    const [loaded, setLoaded] = useState(false)

    useEffect(() => setLoaded(true), [])

    const buttons: { message: string, icon: React.ReactNode }[] = [
        { message: 'do a barrel roll', icon: <ArrowPathIcon className="size-5 mr-2" /> },
        { message: 'do confetti', icon: <div className="size-5 mr-2">🎉</div> },
        { message: 'make it rain ETH', icon: <div className={`mr-2 rounded-full ${theme === 'dark' ? `bg-white` : ``}`}><Image src="/images/ethereum.png" height={15} width={15} alt="ETH" /></div> },
    ]

    const index = useMemo(() => rand(buttons.length), [buttons.length])

    return (loaded &&
        <div>
            <button className={`flex ${styles.button} items-center`} onClick={() => addPrompt(buttons[index].message)}>{buttons[index].icon}{buttons[index].message}</button>
        </div>
    );
}

export default InterestingButton;
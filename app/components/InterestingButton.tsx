import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMessagesContext } from "../context/MessagesContext";
import { styles } from "../utils/styles";
import { useEffect, useMemo, useState } from "react";

const rand = (max: number) => Math.floor(Math.random() * max)

const InterestingButton = () => {
    const { addMessage } = useMessagesContext();
    const [loaded, setLoaded] = useState(false)

    useEffect(() => setLoaded(true), [])

    const buttons: { message: string, icon: React.ReactNode }[] = [
        { message: 'do a barrel roll', icon: <ArrowPathIcon className="size-5 mr-2" /> },
        { message: 'do confetti', icon: <div className="size-5 mr-2">🎉</div> },
        { message: 'make it rain ETH', icon: <div className="size-5 mr-2"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" className="w-5" alt="ETH"/></div> },
    ]
    
    const index = useMemo(()=>rand(buttons.length),[buttons.length])
    
    return (loaded && 
        <div>
            <button className={`flex ${styles.button}`} onClick={() => addMessage(buttons[index].message, "user", true)}>{buttons[index].icon}{buttons[index].message}</button>
        </div>
    );
}

export default InterestingButton;
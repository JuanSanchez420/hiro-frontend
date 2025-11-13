import { useState } from "react"
import { useThemeContext } from "../context/GlobalContext"

interface ConfirmProps {
    show?: boolean;
    transactionId?: string;
    message?: string;
    onConfirm?: (transactionId: string, confirmed: boolean) => void;
}

const Confirm = ({ show = true, transactionId, message, onConfirm }: ConfirmProps) => {
    const { styles } = useThemeContext()
    const [localShow, setLocalShow] = useState(true)

    const handleClick = (confirm: boolean) => {
        if (transactionId && onConfirm) {
            onConfirm(transactionId, confirm)
        }
        setLocalShow(false)
    }

    return (show && localShow &&
        <div className="text-center mt-4">
            {message && <p className="text-sm mb-4">{message}</p>}
            <div className="flex justify-center">
                <button className={`${styles.button} mr-10`} onClick={() => handleClick(true)}>Yes</button>
                <button className={styles.button} onClick={() => handleClick(false)}>No</button>
            </div>
        </div>)
}

export default Confirm

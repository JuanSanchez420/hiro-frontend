import { useMessagesContext } from "../context/Context"
import { styles } from "../utils/styles"

const Confirm = () => {
    const { addMessage, showConfirm, setShowConfirm } = useMessagesContext()

    const handleClick = (confirm: boolean) => {
        addMessage(confirm ? 'Yes' : 'No', "user", true)
        setShowConfirm(false)
    }

    return (
        showConfirm &&
        <div className="flex justify-center mt-4">
            <div className="flex flex-col">
                <div className="flex justify-center">
                    <button className={`${styles.button} mr-10`} onClick={() => handleClick(true)}>Yes</button>
                    <button className={styles.button} onClick={() => handleClick(false)}>No</button>
                </div>
            </div>
        </div>)
}

export default Confirm
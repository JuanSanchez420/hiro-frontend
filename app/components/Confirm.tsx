import { useGlobalContext } from "../context/GlobalContext"
import { usePromptsContext } from "../context/PromptsContext"

const Confirm = () => {
    const { addPrompt } = usePromptsContext()
    const { showConfirm, setShowConfirm, styles } = useGlobalContext()

    const handleClick = (confirm: boolean) => {
        addPrompt(confirm ? "Yes" : "No")
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
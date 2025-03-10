import { useGlobalContext } from "../context/GlobalContext"
import useHiroFactory from "../hooks/useHiroFactory"
import { styles } from "../utils/styles"

const CreateAHiro = () => {
    const { status } = useHiroFactory()
    const { isSignedIn, setWidget } = useGlobalContext()

    if (status === "CREATED" || !isSignedIn) return null

    return (
        <div className="flex justify-center mb-5 animate-pulse">
            {status === "NOT_CREATED" && <button className={`${styles.button}`} onClick={()=>setWidget("Signup")}>Create your Hiro!</button>}
            {status === 'CREATING' && <button className={`italic ${styles.button}`}>Training your Hiro</button>}
        </div>
    )
}

export default CreateAHiro
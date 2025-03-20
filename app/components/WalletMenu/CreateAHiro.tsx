import { Menu, MenuButton} from "@headlessui/react"
import { useGlobalContext } from "../../context/GlobalContext"
import useHiroFactory from "../../hooks/useHiroFactory"

const CreateAHiro = () => {
    const { status } = useHiroFactory()
    const { setWidget, styles } = useGlobalContext()

    return (
        <Menu as="div" className="relative ml-3">
            {status === "NOT_CREATED" && <MenuButton className={`${styles.button} max-w-40 animate-pulse`} onClick={() => setWidget("Signup")}>Create your Hiro!</MenuButton>}
            {status === 'CREATING' && <MenuButton className={`${styles.button} max-w-40 animate-pulse`} disabled>Training your Hiro</MenuButton>}
        </Menu>
    )
}

export default CreateAHiro
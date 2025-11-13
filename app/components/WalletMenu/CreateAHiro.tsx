import { Menu, MenuButton} from "@headlessui/react"
import { useThemeContext, useWidgetContext } from "../../context/GlobalContext"
import useHiroFactory from "../../hooks/useHiroFactory"

const CreateAHiro = () => {
    const { status } = useHiroFactory()
    const { setWidget } = useWidgetContext()
    const { styles } = useThemeContext()

    console.log('[CreateAHiro] Rendering with status:', status);

    // Don't render anything if Hiro is already created - let the normal user menu show
    if (status === 'CREATED') {
        return null;
    }

    return (
        <Menu as="div" className="relative ml-3">
            {status === "NOT_CREATED" && (
                <MenuButton className={`${styles.button} max-w-40 animate-pulse`} onClick={() => setWidget("Signup")}>
                    Create your Hiro!
                </MenuButton>
            )}
            {status === 'CREATING' && (
                <MenuButton className={`${styles.button} max-w-40 animate-pulse`} disabled>
                    Training your Hiro
                </MenuButton>
            )}
        </Menu>
    )
}

export default CreateAHiro

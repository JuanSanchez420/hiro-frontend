import Link from "next/link"
import { useThemeContext } from "../context/GlobalContext"

const BackButton = () => {
    const { styles } = useThemeContext()

    return (
        <Link href="/"><button
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 mb-4 ${styles.button}`}>
            Back
        </button></Link>
    )
}

export default BackButton

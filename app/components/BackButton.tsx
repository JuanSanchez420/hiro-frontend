import Link from "next/link"
import { styles } from "../utils/styles"

const BackButton = () => {
    return (
        <Link href="/"><button
            className={`absolute bg-white bottom-0 left-1/2 -translate-x-1/2 mb-4 ${styles.button}`}>
            Back
        </button></Link>
    )
}

export default BackButton
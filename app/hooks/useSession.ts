import { useEffect } from "react"
import { useAccount } from "wagmi"


const useSession = () => {
    const account = useAccount()

    useEffect(() => {
        const f = async () => {
            const response = await fetch(`/api/account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ account: account.address })
            })
            const data = await response.json()
            if (data.error) {
                console.error(data.error)
            }
        }
        if (account?.isConnected) {
            f()
        }
    }, [account.address, account.isConnected])
}

export default useSession
import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useMessagesContext } from "../context/Context"


const useSession = () => {
    const { hasSession, setHasSession } = useMessagesContext()
    const account = useAccount()

    useEffect(() => {
        if (account?.isConnected && !hasSession) {
            console.log('setting session')
            fetch('/api/session', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ account: account.address })
            })
                .then(() => {
                    return fetch('/api/session', {
                        method: 'GET',
                        credentials: 'include'
                    });
                })
                .then(() => setHasSession(true))
                .catch(console.error)
        }
    }, [account.address, account.isConnected, setHasSession, hasSession])
}

export default useSession
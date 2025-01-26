import { useEffect, useRef } from "react"
import { useMessagesContext } from "../context/Context"
import { useAccount } from "wagmi"


const useSession = () => {
    const didFetch = useRef(false)
    const account = useAccount()
    const { session, setSession } = useMessagesContext()

    useEffect(() => {
        const f = async () => {
            didFetch.current = true
            const response = await fetch("/api/session", {
                credentials: 'include',
            })
            const data = await response.json()

            setSession(data.sessionId)
        }
        if (!session && !didFetch.current) f()
    }, [session, setSession])

    useEffect(() => {
        if (account && didFetch.current) {
            const f = async () => {
                const response = await fetch("/api/account", {
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
            f()
        }
    }, [didFetch, account])
}

export default useSession
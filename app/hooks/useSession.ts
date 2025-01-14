import { useEffect, useRef } from "react"
import { useMessagesContext } from "../context/Context"


const useSession = () => {
    const didFetch = useRef(false)
    const { session, setSession } = useMessagesContext()

    useEffect(()=>{
        const f = async () => {
            didFetch.current = true
            const response = await fetch("/api/session", {
                credentials: 'include',
              })
            const data = await response.json()
            console.log(data)
            setSession(data.sessionId)
        }
        if(!session && !didFetch.current) f()
    }, [session, setSession])
}

export default useSession
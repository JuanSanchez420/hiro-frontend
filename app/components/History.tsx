import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { MessageSession } from "../types"
import { normalizeMessages } from "../utils/normalizeMessages"
import { useMessagesContext } from "../context/MessagesContext"
import { usePromptsContext } from "../context/PromptsContext"
import { useDrawerContext } from "../context/GlobalContext"

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

const History = () => {
    const [sessions, setSessions] = useState<MessageSession[]>([])
    const [loading, setLoading] = useState(false)
    const { setMessages } = useMessagesContext()
    const { resetPrompts } = usePromptsContext()
    const { setDrawerState } = useDrawerContext()

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/history')
                if (!response.ok) {
                    console.error('Failed to load history:', response.statusText)
                    setSessions([])
                    return
                }

                const data = await response.json()
                if (data && Array.isArray(data.sessions)) {
                    const transformed = data.sessions.map((rawSession: unknown, index: number) => {
                        const session = (typeof rawSession === 'object' && rawSession !== null)
                            ? rawSession as Record<string, unknown>
                            : {};

                        const rawMessages = Array.isArray(session.messages) ? session.messages : [];

                        return {
                            sessionId: typeof session.sessionId === 'string' ? session.sessionId : `session-${index}`,
                            timestamp: typeof session.timestamp === 'number' ? session.timestamp : 0,
                            messageCount: typeof session.messageCount === 'number' ? session.messageCount : rawMessages.length,
                            messages: normalizeMessages(rawMessages),
                        } satisfies MessageSession
                    })
                    setSessions(transformed)
                } else {
                    console.error('History API returned unexpected format:', data)
                    setSessions([])
                }
            } catch (error) {
                console.error('Error loading history:', error)
                setSessions([])
            } finally {
                setLoading(false)
            }
        }

        loadHistory()
    }, [])

    const items = useMemo(() => {
        return sessions.map((session) => {
            const firstUserMessage = session.messages.find((msg) => msg.type === 'user')
            const title = firstUserMessage?.message || `Session ${session.sessionId}`
            return {
                key: session.sessionId,
                title,
                messageCount: session.messageCount,
                session,
            }
        })
    }, [sessions])

    const handleSessionClick = (session: MessageSession) => {
        resetPrompts()
        setMessages(session.messages)
        setDrawerState({ isOpen: false, showRecommendations: false })
    }

    if (loading) {
        return <div className="flex justify-center p-4">Loading...</div>
    }

    return <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
            <ul role="list" className="-mx-2 space-y-1">
                {items.map((item) => (
                    <li key={`history-${item.key}`}>
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSessionClick(item.session)
                            }}
                            className={classNames(
                                'text-gray-700 hover:bg-gray-50 hover:text-emerald-600',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                'truncate'
                            )}
                        >
                            <span className="truncate">{item.title.length > 50
                                ? `${item.title.substring(0, 50)}...`
                                : item.title}</span>
                            <span className="ml-auto text-xs text-gray-400">{item.messageCount}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    </ul>
}

export default History 

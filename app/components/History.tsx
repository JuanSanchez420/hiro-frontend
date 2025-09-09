import Link from "next/link"
import { useMessagesContext } from "../context/MessagesContext"
import { useEffect } from "react"

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

const History = () => {
    const { messages, loadMessages, loading } = useMessagesContext();

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const userMessages = Array.isArray(messages) ? messages.filter(msg => msg.type === "user") : [];

    if (loading) {
        return <div className="flex justify-center p-4">Loading...</div>
    }

    return <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
            <ul role="list" className="-mx-2 space-y-1">
                {userMessages.map((message, i) => (
                    <li key={`history-${i}`}>
                        <Link
                            href="#"
                            className={classNames(
                                'text-gray-700 hover:bg-gray-50 hover:text-emerald-600',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                'truncate'
                            )}
                        >
                            {message.message.length > 50 
                                ? message.message.substring(0, 50) + "..." 
                                : message.message}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    </ul>
}

export default History 
import Link from "next/link"

type HistoryObj = {
    prompt: string
    functionCall: string | null
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

const History = () => {

    const histories: HistoryObj[] = [
        {prompt: "prompt would be here", functionCall: null},
        {prompt: "prompt would be here", functionCall: null},
        {prompt: "prompt would be here", functionCall: "params obj"}
    ]

    return <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
            <ul role="list" className="-mx-2 space-y-1">
                {histories.map((item, i) => (
                    <li key={`history-${i}`}>
                        <Link
                            href="#"
                            className={classNames(
                                'text-gray-700 hover:bg-gray-50 hover:text-emerald-600',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                'truncate'
                            )}
                        >
                            {item.prompt}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    </ul>
}

export default History 
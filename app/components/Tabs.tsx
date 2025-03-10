import { useAccount } from 'wagmi';
import { WidgetOption } from '../types';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const tabs = [
    { name: 'Swap', href: '#' },
    { name: 'Earn', href: '#' },
    //{ name: 'Lend', href: '#' },
    //{ name: 'Borrow', href: '#' },
    { name: 'Autonomous', href: '#' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const [loaded, setLoaded] = useState(false)
    const account = useAccount()
    const { widget, setWidget, setDrawerRightOpen } = useGlobalContext();

    useEffect(() => {
        setLoaded(true)
    }
        , [])

    return (loaded &&
        <div className='mb-1'>
            <div className="min-w-full w-full overflow-hidden">
                <div
                    className="flex overflow-x-auto justify-between gap-4"
                >
                    {tabs.map((tab) => (
                        <a
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                                tab.name === widget ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
                                'rounded-md px-1 py-2 text-sm font-medium', 'flex items-center justify-center'
                            )}
                            onClick={() => setWidget(tab.name as WidgetOption)}
                        >
                            {tab.name}
                        </a>
                    ))}
                    {account && account.isConnected ? <a href="#" onClick={() => setDrawerRightOpen(true)}
                        className={`text-gray-500 hover:text-gray-700 rounded-md px-1 py-2 text-sm font-medium`}>Portfolio</a>
                        :
                        <a href="#" onClick={() => setDrawerRightOpen(true)}
                            className={`text-gray-500 hover:text-gray-700 rounded-md px-1 py-2 text-sm font-medium`}>Market</a>}
                </div>
            </div>
        </div>
    )
}


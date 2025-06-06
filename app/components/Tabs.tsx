
import { WidgetOption } from '../types';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { ArrowDownTrayIcon, ArrowsRightLeftIcon, ArrowUpTrayIcon, CpuChipIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const tabs = [
    { name: 'Swap', icon: <ArrowsRightLeftIcon className="size-5 mr-2" /> },
    { name: 'Earn', icon: <CurrencyDollarIcon className="size-5 mr-2" /> },
    { name: 'Lend', icon: <ArrowUpTrayIcon className="size-5 mr-2" /> },
    { name: 'Borrow', icon: <ArrowDownTrayIcon className="size-5 mr-2" />   },
    { name: 'Autonomous', icon: <CpuChipIcon className="size-5 mr-2" /> },
]

export default function Tabs() {
    const [loaded, setLoaded] = useState(false)
    const { setWidget, styles } = useGlobalContext();

    useEffect(() => {
        setLoaded(true)
    },[])

    return (loaded &&
        <div className='mb-3'>
            <div className="min-w-full w-full overflow-hidden">
                <div
                    className="flex overflow-x-auto justify-between gap-4 scrollbar-hidden"
                >
                    {tabs.map((tab) => (
                        <button key={tab.name} className={`flex ${styles.button}`} onClick={() => setWidget(tab.name as WidgetOption)}>{tab.icon}{tab.name}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}


import { useMessagesContext } from '../context/Context';
import Link from 'next/link';
import { WidgetOption } from '../types';

const tabs = [
    { name: 'Swap', href: '#' },
    { name: 'Earn', href: '#' },
    { name: 'Lend', href: '#' },
    { name: 'Autonomous', href: '#' },
    { name: 'Portfolio', href: '#' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const { widget, setWidget } = useMessagesContext();
    return (
        <div className='mb-1'>
            <nav aria-label="Tabs" className="flex space-x-4 justify-between">
                {tabs.map((tab) => (
                    tab.name === 'Portfolio' ?
                        <Link href="/portfolio" key={tab.name} className={classNames(
                            'text-gray-500 hover:text-gray-700',
                            'rounded-md px-3 py-2 text-sm font-medium',
                        )}>
                            {tab.name}
                        </Link> :
                        <a
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                                tab.name === widget ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
                                'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                            onClick={() => setWidget(tab.name as WidgetOption)}
                        >
                            {tab.name}
                        </a>
                ))}
            </nav>
        </div>
    )
}


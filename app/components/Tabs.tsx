import { useAccount } from 'wagmi';
import { useMessagesContext } from '../context/Context';
import { WidgetOption } from '../types';

const tabs = [
    { name: 'Swap', href: '#', highlight: 'swap' },
    { name: 'Earn', href: '#', highlight: 'add/removeliquidity' },
    { name: 'Autonomous', href: '#', highlight: 'autonomousinstructions' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const account = useAccount()
    const { widget, setWidget, setDrawerRightOpen, highlight } = useMessagesContext();
    
    return (
        <div className='mb-1'>
            <nav aria-label="Tabs" className="flex space-x-4 justify-between">
                {tabs.map((tab) => (
                    <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                            tab.name === widget ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
                            'rounded-md px-3 py-2 text-sm font-medium', highlight && highlight === `highlight-${tab.highlight}` ? 'animate-bounce' : ''
                        )}
                        onClick={() => setWidget(tab.name as WidgetOption)}
                    >
                        {tab.name}
                    </a>
                ))}
                {account && account.isConnected ? <a href="#" onClick={() => setDrawerRightOpen(true)} 
                    className={`${highlight && highlight=== `highlight-portfolio` ? 'animate-bounce' : ''} text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium`}>Portfolio</a>
                    :
                    <a href="#" onClick={() => setDrawerRightOpen(true)} 
                        className={`${highlight && highlight=== `highlight-portfolio` ? 'animate-bounce' : ''} text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium"`}>Market</a>}

            </nav>
        </div>
    )
}


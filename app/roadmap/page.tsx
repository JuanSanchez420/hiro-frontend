'use client'

import { CheckIcon, ClockIcon, CogIcon } from '@heroicons/react/20/solid'
import BackButton from '../components/BackButton'

const timeline = [
    {
        id: 1,
        content: 'Build an agent that can ',
        target: 'chat, swap, and farm',
        href: '#',
        date: 'Jan 1',
        datetime: '2025-01-01',
        icon: CheckIcon,
        iconBackground: 'bg-green-500',
    },
    {
        id: 2,
        content: 'Set up a ',
        target: 'website',
        href: '#',
        date: 'Jan 12',
        datetime: '2025-01-01',
        icon: CheckIcon,
        iconBackground: 'bg-green-500',
    },
    {
        id: 3,
        content: 'Set up an ',
        target: 'X account',
        href: '#',
        date: 'Jan 12',
        datetime: '2025-01-12',
        icon: CheckIcon,
        iconBackground: 'bg-green-500',
    },
    {
        id: 4,
        content: 'Create smart contracts for ',
        target: 'HIRO token and factory',
        href: '#',
        date: 'Jan 15',
        datetime: '2020-01-15',
        icon: CheckIcon,
        iconBackground: 'bg-green-500',
    },
    {
        id: 5,
        content: 'UX smoothing and ',
        target: 'testing',
        href: '#',
        date: 'Jan 25',
        datetime: '2020-01-25',
        icon: CogIcon,
        iconBackground: 'bg-yellow-500',
    },
    {
        id: 6,
        content: 'Prepare ',
        target: 'for launch',
        href: '#',
        date: 'Jan 26',
        datetime: '2020-01-26',
        icon: CogIcon,
        iconBackground: 'bg-yellow-500',
    },
    {
        id: 7,
        content: 'Enable ',
        target: 'autonomous execution',
        href: '#',
        date: 'Feb 1',
        datetime: '2025-02-01',
        icon: CogIcon,
        iconBackground: 'bg-yellow-500',
    },{
        id: 8,
        content: 'Portfolio, market data, and charts ',
        target: 'for improved trading',
        href: '#',
        date: 'Feb 15',
        datetime: '2025-02-15',
        icon: ClockIcon,
        iconBackground: 'bg-gray-500',
    },{
        id: 9,
        content: 'Enable ',
        target: 'personalization and agent specialization',
        href: '#',
        date: 'Feb 30',
        datetime: '2025-02-15',
        icon: ClockIcon,
        iconBackground: 'bg-gray-500',
    },{
        id: 10,
        content: '',
        target: 'Open Source codebase',
        href: '#',
        date: 'TBD',
        datetime: '2025-02-15',
        icon: ClockIcon,
        iconBackground: 'bg-gray-500',
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function RoadMap() {
    return (
        <div className="flow-root">
            <h1 className='font-2xl uppercase font-bold mb-5'>Roadmap</h1>
            <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {eventIdx !== timeline.length - 1 ? (
                                <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span
                                        className={classNames(
                                            event.iconBackground,
                                            'flex size-8 items-center justify-center rounded-full ring-8 ring-white',
                                        )}
                                    >
                                        <event.icon aria-hidden="true" className="size-5 text-white" />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {event.content}{' '}
                                            <a href={event.href} className="font-medium text-gray-900">
                                                {event.target}
                                            </a>
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={event.datetime}>{event.date}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <BackButton />
        </div>
    )
}

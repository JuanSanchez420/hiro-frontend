import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

type Page = {
    name: string
    href: string
    current: boolean
}

export default function Breadcrumbs({ pages }: { pages: Page[] }) {

    return (
        <nav aria-label="Breadcrumb" className="flex mb-5">
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <div>
                        <Link href="/" className="hover:text-gray-500"><HomeIcon aria-hidden="true" className="size-5 shrink-0" /></Link>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name}>
                        <div className="flex items-center">
                            <ChevronRightIcon aria-hidden="true" className="size-5 shrink-0" />
                            <a
                                href={page.href}
                                aria-current={page.current ? 'page' : undefined}
                                className="ml-4 text-sm font-medium hover:text-gray-700"
                            >
                                {page.name}
                            </a>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

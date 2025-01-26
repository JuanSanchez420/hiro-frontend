'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMessagesContext } from '../context/Context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Drawer() {
  const { drawerOpen, setDrawerOpen } = useMessagesContext();
  const path = usePathname();

  const navigation = [
    { name: 'Chat', href: '/', current: path === '/' },
    { name: 'Token', href: '/hiro-token', current: path.startsWith('/hiro-token') },
    { name: 'Roadmap', href: '/roadmap', current: path.startsWith('/roadmap') },
    { name: 'FAQ', href: '/faq', current: path.startsWith('/faq') },
  ]

  return (
    <Dialog open={drawerOpen} onClose={setDrawerOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute right-0 top-0 -mr-8 flex pl-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-mr-10 sm:pl-4">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold text-gray-900">{/* title area */}</DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {/* Your content */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-50 text-emerald-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                )}
                                onClick={() => setDrawerOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

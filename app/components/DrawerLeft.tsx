'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useGlobalContext } from '../context/GlobalContext';
import History from "./History"
import ThemeToggle from './ThemeToggle';

export default function Drawer() {
  const { drawerLeftOpen, setDrawerLeftOpen, styles } = useGlobalContext();

  return (
    <Dialog open={drawerLeftOpen} onClose={setDrawerLeftOpen} className="relative z-10">
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
                <div className="absolute right-0 top-0 -mr-8 flex pl-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:pl-4">
                  <button
                    type="button"
                    onClick={() => setDrawerLeftOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className={`flex h-full flex-col overflow-y-scroll py-6 shadow-xl ${styles.background} ${styles.text}`}>
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold">{/* title area */}</DialogTitle>
                </div>
                <div className="relative mt-6 px-4 sm:px-6 flex flex-col h-full">
                  {/* Your content */}
                  <nav className="flex flex-col flex-grow">
                    <div className='flex justify-between mb-2'>
                      <div className='bold'>History</div>
                      <div><button className={styles.buttonSm} onClick={() => confirm('Are you sure?')}>Clear</button></div>
                    </div>
                    <History />
                  </nav>
                  <div className='mt-auto pt-4'><ThemeToggle /></div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

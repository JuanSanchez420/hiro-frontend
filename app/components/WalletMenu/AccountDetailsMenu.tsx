'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import useHiro from '@/app/hooks/useHiro'
import { NULL_ADDRESS } from '@/app/utils/constants'
import { useGlobalContext } from '@/app/context/GlobalContext'

const AccountDetails = () => {
  const { hiro } = useHiro()
  const account = useAccount()
  const { setWidget, styles, theme } = useGlobalContext();
  const { disconnect } = useDisconnect()
  const itemClass = theme === 'light' ? "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none" :
    "block px-4 py-2 text-sm text-gray-300 data-[focus]:bg-gray-800 data-[focus]:outline-none"

  return (<Menu as="div" className="relative ml-3">
    <div>
      <MenuButton className={`${styles.button} max-w-40`}>
        <div className='overflow-hidden text-ellipsis'>{account?.address}</div>
      </MenuButton>
    </div>
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      <MenuItem>
        <a
          href={`https://basescan.org/address/${account?.address}`}
          className={itemClass}
          target="_blank"
        >
          Basescan for wallet
        </a>
      </MenuItem>
      {hiro && hiro !== NULL_ADDRESS && <MenuItem>
        <a
          href={`https://basescan.org/address/${hiro}`}
          className={itemClass}
          target="_blank"
        >
          Basescan for Hiro
        </a>
      </MenuItem>}
      <MenuItem>
        <a
          href="#"
          className={itemClass}
          target="_blank"
          onClick={(e) => {
            e.preventDefault()
            setWidget('Deposit')
          }
          }
        >
          Deposit
        </a>
      </MenuItem>
      <MenuItem>
        <a
          href="#"
          className={itemClass}
          target="_blank"
          onClick={(e) => {
            e.preventDefault()
            setWidget('Withdraw')
          }}
        >
          Withdraw
        </a>
      </MenuItem>
      <MenuItem>
        <a
          href="#"
          className={itemClass}
          onClick={() => disconnect()}
        >
          Disconnect
        </a>
      </MenuItem>
    </MenuItems>
  </Menu>)
}

export default AccountDetails
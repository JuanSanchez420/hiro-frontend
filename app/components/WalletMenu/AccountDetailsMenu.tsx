'use client'

import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { styles } from '../../utils/styles'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const AccountDetails = () => {

  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const itemClass = "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"

  return (<Menu as="div" className="relative ml-3">
    <div>
      <MenuButton className={`${styles.button} max-w-40`}>
        {address && <div className='overflow-hidden text-ellipsis'>{ensName ? `${ensName} (${address})` : address}</div>}
      </MenuButton>
    </div>
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      <MenuItem>
        <a
          href={`https://basescan.org/address/${address}`}
          className={itemClass}
          target="_blank"
        >
          Basescan
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
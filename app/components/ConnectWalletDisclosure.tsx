'use client'

import { Connector, CreateConnectorFn, useAccount, useConnect } from "wagmi"
import AccountDetails from "./AccountDetailsMenu"
import { useCallback, useEffect, useState } from "react"
import { styles } from "../utils/styles"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

const ConnectWallet = () => {
    const { connectors, connect } = useConnect()
    const { isConnected } = useAccount()
    const [isLoaded, setIsLoaded] = useState(false)
    const itemClass = "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"

    // wagmi is trying to render server side, these help prevent that
    useEffect(() => {
        if (connectors?.length > 0) setIsLoaded(true)
    }, [connectors])

    const handleConnect = useCallback(
        (connector: Connector<CreateConnectorFn>) => {
            connect({ connector });
        },
        [connect]
    )

    if (!isLoaded) return <div>Loading...</div>

    const WalletMenu = () => {
        return (<Menu as="div" className="relative ml-3">
            <div>
                <MenuButton className={`${styles.button} max-w-40`}>
                    Connect Wallet
                </MenuButton>
            </div>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                {connectors.map((connector, i) => (
                    <MenuItem key={`connector-${i}`}>
                        <a href="#" className={itemClass} onClick={() => handleConnect(connector)}>
                            {connector.name}
                        </a>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>)
    }

    return isConnected ? <AccountDetails /> : connectors?.length > 0 ? <WalletMenu /> : <div>No connectors available</div>
}

export default ConnectWallet
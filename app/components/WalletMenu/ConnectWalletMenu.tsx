'use client'

import { Connector, CreateConnectorFn, useAccount, useConnect, useDisconnect } from "wagmi"
import AccountDetails from "./AccountDetailsMenu"
import { useCallback, useEffect, useState } from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import useSIWE from "../../hooks/useSIWE"
import { useAuthContext, useThemeContext } from "../../context/GlobalContext"
import { NULL_ADDRESS } from "@/app/utils/constants"
import { usePortfolioContext } from "@/app/context/PortfolioContext"
import CreateAHiro from "./CreateAHiro"
import { Spinner } from "../Spinner"

const ConnectWallet = () => {
    const { isSignedIn } = useAuthContext()
    const { styles, theme } = useThemeContext()
    const { connectors, connect } = useConnect()
    const { isConnected } = useAccount()
    const { portfolio } = usePortfolioContext()
    const { doSIWE } = useSIWE()
    const { disconnect } = useDisconnect()
    const [isLoaded, setIsLoaded] = useState(false)
    const itemClass = theme === 'light' ? "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none" :
        "block px-4 py-2 text-sm text-gray-300 data-[focus]:bg-gray-800 data-[focus]:outline-none"
    
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

    useEffect(() => {
        if (isLoaded && !isConnected) {
            const previouslyAuthorizedConnector = connectors.find((connector) => connector.ready);
            if (previouslyAuthorizedConnector && !isConnected) {
                connect({ connector: previouslyAuthorizedConnector });
            }
        }
    }, [isLoaded, connect, connectors, isConnected])

    if (!isLoaded) return <Menu as="div" className="relative ml-3">
        <MenuButton className={`${styles.button} max-w-40 flex justify-center`}>
            <Spinner /><span>Loading...</span>
        </MenuButton>
    </Menu>

    const WalletMenu = () => {
        return (<Menu as="div" className="relative ml-3">
            <div>
                <MenuButton className={`${styles.button} max-w-40`}>
                    Connect Wallet
                </MenuButton>
            </div>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                {connectors.map((connector, i) => (
                    <MenuItem key={`connector-${i}`}>
                        <a href="#" className={itemClass} onClick={() => { handleConnect(connector) }}>
                            {connector.name}
                        </a>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>)
    }

    const SignIn = () => {
        return (
            <Menu as="div" className="relative ml-3">
                <div>
                    <MenuButton className={`${styles.button} w-40 animate-pulse`}>
                        Sign In
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <MenuItem>
                        <a href="#" className={itemClass} onClick={doSIWE}>
                            Sign In with Ethereum
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a href="#" className={itemClass} onClick={() => disconnect()}>
                            Disconnect Wallet
                        </a>
                    </MenuItem>
                </MenuItems>
            </Menu>
        )
    }

    if (isConnected && isSignedIn && portfolio?.hiro && portfolio.hiro !== NULL_ADDRESS) return <AccountDetails />

    if (isConnected && isSignedIn && (!portfolio?.hiro || portfolio.hiro === NULL_ADDRESS)) return <CreateAHiro />

    if (isConnected) return <SignIn />

    return <WalletMenu />
}

export default ConnectWallet

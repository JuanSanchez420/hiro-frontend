import { createConfig } from '@wagmi/core'
import { http, Chain } from 'viem'
import { metaMask, walletConnect } from 'wagmi/connectors'

export const localChain: Chain = {
  id: 31338,
  name: 'Localhost',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost' },
  },
  testnet: true,
}

export const baseChain: Chain = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://rpc.ankr.com/base/3ec8a99c8d8a9f1d4b41cbbd6849bd882e7af57f597634fd1f39c6cb5986656f'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
  testnet: false,
}

// Use Base chain in production, local chain otherwise
const isProduction = process.env.NODE_ENV === 'production'
const activeChain = isProduction ? baseChain : localChain

export const config = createConfig({
  chains: [activeChain],
  connectors: [
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4526e97c2d68b2ce0c2150cd2102187a' }),
    metaMask({ shouldShimWeb3: false}),
  ],
  transports: {
    [activeChain.id]: http(),
  },
})
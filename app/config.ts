import { createConfig } from '@wagmi/core'
import { http, Chain } from 'viem'
import { base } from 'viem/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

export const localChain: Chain = {
  id: base.id,
  name: 'Localhost',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] }, // Local RPC URL
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'http://localhost:8545' }, // Optional
  },
  testnet: true,
}

export const config = createConfig({
  chains: [localChain],
  connectors: [
    walletConnect({ projectId: '4526e97c2d68b2ce0c2150cd2102187a' }),
    metaMask({ shouldShimWeb3: false}),
  ],
  transports: {
    [localChain.id]: http(),
  },
})

/*
const account = privateKeyToAccount((process.env.PRIVATE_KEY || '0x') as `0x${string}`)

// export const walletClient = await getWalletClient(config, { account })

export const walletClient = createWalletClient({
  account,
  chain: config.chains[0],
  transport: http(config.chains[0].rpcUrls.default.http[0]),
})

export const publicClient = getClient(config)
*/

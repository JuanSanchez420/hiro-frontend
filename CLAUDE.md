# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js TypeScript configuration

## Environment Setup

### Development (NODE_ENV=development)
**Required Dependencies:**
1. **Local Blockchain**: Ethereum node running on chain ID 31338 at `http://localhost:8545`
2. **Backend Server**: Express server running on `http://localhost:4000`
3. **Environment Variables**: Copy `.env` and adjust if needed:
   - `NEXT_PUBLIC_EXPRESS_URL=http://localhost`
   - `NEXT_PUBLIC_EXPRESS_PORT=4000`
   - `NEXT_PUBLIC_RPC_URL=http://localhost:8545`
   - `NEXT_PUBLIC_BASE_RPC_URL=https://rpc.ankr.com/base/...`
   - `NEXT_PUBLIC_HIRO_FACTORY=<deployed_contract_address>`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_project_id>`

**Startup Sequence (Development):**
1. Start local blockchain (e.g., Foundry Anvil on chain 31338)
2. Deploy contracts and update `NEXT_PUBLIC_HIRO_FACTORY` in `.env`
3. Start backend Express server on port 4000
4. Run `npm run dev` to start frontend

### Production (NODE_ENV=production)
**Required Configuration:**
1. **Base Chain**: Automatically uses Base mainnet (chain ID 8453)
2. **Backend Server**: Production backend URL
3. **Environment Variables**: Update `.env.production`:
   - `NEXT_PUBLIC_EXPRESS_URL=https://your-backend-domain.com`
   - `NEXT_PUBLIC_EXPRESS_PORT=443`
   - `NEXT_PUBLIC_BASE_RPC_URL=https://rpc.ankr.com/base/...`
   - `NEXT_PUBLIC_HIRO_FACTORY=<deployed_contract_on_base>`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_project_id>`

**Chain Selection Logic:**
- `NODE_ENV=production` → Base mainnet (chain ID 8453)
- `NODE_ENV=development` → Local chain (chain ID 31338)
- Configuration in `app/config.ts` automatically selects the appropriate chain

## Architecture Overview

This is a crypto DeFi frontend application called "Hiro" built with Next.js 15 App Router and React 19. It's designed as an AI agent interface for simplifying crypto interactions.

### Key Technologies
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Wagmi + Viem** for Web3 wallet connectivity
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **HeadlessUI** for accessible UI components

### Application Structure

**Core Layout & Providers:**
- `app/layout.tsx` - Root layout with navigation, theme provider, and context providers
- `app/providers.tsx` - Wagmi and TanStack Query providers
- `app/page.tsx` - Main chat interface with Hiro AI assistant

**Context Management:**
- `app/context/GlobalContext.tsx` - Global UI state (drawers, widgets, themes, auth)
- `app/context/PromptsContext.tsx` - Chat prompts and conversation state
- `app/context/MessagesContext.tsx` - Message history management
- `app/context/PortfolioContext.tsx` - Portfolio and DeFi position data (fetches from `/api/portfolio`)

**Widget System:**
The application uses a widget-based architecture for DeFi interactions:
- `app/components/widgets/Widget.tsx` - Main widget container
- Individual widgets: `SwapWidget`, `LendWidget`, `BorrowWidget`, `LiquidityWidget`, etc.
- Widget state managed through `GlobalContext.widget`

**Web3 Configuration:**
- `app/config.ts` - Wagmi configuration with dual-chain support:
  - **Development**: Local blockchain (chain ID 31338)
  - **Production**: Base mainnet (chain ID 8453)
- Uses MetaMask and WalletConnect connectors
- Chain selection is automatic based on `NODE_ENV`
- Exports: `localChain`, `baseChain`, `config` (active configuration)

**DeFi Integrations:**
- Aave lending/borrowing functionality
- Uniswap-style liquidity positions
- Portfolio tracking with token balances and positions
- Market data with OHLC candlestick charts

### Key Data Types

**Portfolio Structure:**
```typescript
interface Portfolio {
  address: `0x${string}`;
  hiro: `0x${string}`;
  balance: string;
  hiroBalance: string;
  tokens: { symbol: string; balance: string; usdPrice: number; }[];
  positions: SimpleLiquidityPosition[];
  aave: AaveUserPosition[];
  timestamp: number;
}
```

**Message Structure:**
```typescript
interface Message {
  message: string
  type: "user" | "assistant" | "function"
  functionCall?: Record<string, unknown>
  waitingForConfirmation?: boolean
  transactionId?: string
  completed: boolean
}
```

**Widget Types:**
- `WidgetOption` includes: "Swap", "Earn", "Autonomous", "Deposit", "Withdraw", "Signup", "Lend", "Borrow"

### UI/UX Patterns

**Drawer System:**
- Left drawer for navigation/menu
- Right drawer for portfolio/position details
- Managed via `GlobalContext.drawerLeftOpen` and `drawerRightOpen`

**Theme System:**
- Light/dark mode toggle
- Styles generated via `utils/styles.ts` based on theme
- CSS variables for background/foreground colors

**Chat Interface:**
- Main conversation via `MessageBox` component (`app/components/MessageBox.tsx`)
- `PromptAndResponse` component handles rendering prompts and streaming responses
- `useChatEventStream` hook manages SSE connection for real-time AI responses
- Event-driven architecture with support for function calls, confirmations, and streaming
- Function results are displayed in collapsible `Disclosure` panels (closed by default)
- Transaction confirmations handled via `Confirm` component

### Development Notes

- Uses `'use client'` directive for client components throughout
- Strict TypeScript configuration with ES2020 target
- ESLint configured with Next.js core-web-vitals and TypeScript rules
- All components follow React 19 patterns with proper memo usage
- Web3 interactions use Wagmi v2 with Viem for type safety
- TypeScript path alias: `@/*` maps to project root (e.g., `@/app/components/Widget`)

### API Routes

Located in `app/api/` with various endpoints for:
- Portfolio data (`/api/portfolio`) - Fetches user portfolio including tokens, positions, and Aave data
- Price data (`/api/prices`) - Market data and OHLC charts
- User account management (`/api/account`)
- Session handling (`/api/session`)
- Wallet updates (`/api/update-wallet`)
- Transaction confirmations (`/api/confirm`) - Handles user confirmations for transactions

### Development & Production Environments

**Development (NODE_ENV=development):**
- Uses local blockchain (chain ID 31338)
- RPC URL: `http://localhost:8545` (configurable via `NEXT_PUBLIC_RPC_URL`)
- Test mode with demo functionality enabled
- Demo transactions show `transactionHash: '0xdummytxhash'`
- Backend on `http://localhost:4000`

**Production (NODE_ENV=production):**
- Uses Base mainnet (chain ID 8453)
- RPC URL: Ankr Base RPC (configurable via `NEXT_PUBLIC_BASE_RPC_URL`)
- Production backend (configurable via `NEXT_PUBLIC_EXPRESS_URL`)
- Real on-chain transactions only

### Important Implementation Details

**Event Stream Flow:**
1. User submits prompt via `PromptInput`
2. `useChatEventStream` hook establishes SSE connection
3. Backend streams function calls, confirmations, and assistant messages
4. Function calls may require user confirmation via `Confirm` component
5. Confirmed transactions trigger portfolio refresh via `fetchPortfolio()`
6. Confetti animation on successful transactions
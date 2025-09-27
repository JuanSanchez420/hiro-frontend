# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js TypeScript configuration

## Environment Setup

**Required Dependencies:**
1. **Local Blockchain**: Ethereum node running on chain ID 31338 at `http://localhost:8545`
2. **Backend Server**: Express server running on `http://localhost:4000`
3. **Environment Variables**: Copy `.env` and adjust if needed:
   - `NEXT_PUBLIC_EXPRESS_URL=http://localhost`
   - `NEXT_PUBLIC_EXPRESS_PORT=4000`
   - `NEXT_PUBLIC_RPC_URL=http://localhost:8545`
   - `NEXT_PUBLIC_HIRO_FACTORY=<deployed_contract_address>`

**Startup Sequence:**
1. Start local blockchain (e.g., Foundry Anvil on chain 31338)
2. Deploy contracts and update `NEXT_PUBLIC_HIRO_FACTORY` in `.env`
3. Start backend Express server on port 4000
4. Run `npm run dev` to start frontend

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
- `app/context/PortfolioContext.tsx` - Portfolio and DeFi position data

**Widget System:**
The application uses a widget-based architecture for DeFi interactions:
- `app/components/widgets/Widget.tsx` - Main widget container
- Individual widgets: `SwapWidget`, `LendWidget`, `BorrowWidget`, `LiquidityWidget`, etc.
- Widget state managed through `GlobalContext.widget`

**Web3 Configuration:**
- `app/config.ts` - Wagmi configuration for local blockchain (chain ID 31338)
- Uses MetaMask and WalletConnect connectors
- Configured for localhost development environment

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
- Main conversation via `MessageBox` component
- Prompt input with streaming responses
- Event-driven architecture for real-time updates

### Development Notes

- Uses `'use client'` directive for client components throughout
- Strict TypeScript configuration with ES2020 target
- ESLint configured with Next.js core-web-vitals and TypeScript rules
- All components follow React 19 patterns with proper memo usage
- Web3 interactions use Wagmi v2 with Viem for type safety
- TypeScript path alias: `@/*` maps to project root (e.g., `@/app/components/Widget`)

### API Routes

Located in `app/api/` with various endpoints for:
- Portfolio data (`/api/portfolio`)
- Price data (`/api/prices`)
- User account management (`/api/account`)
- Session handling (`/api/session`)
- Wallet updates (`/api/update-wallet`)

### Testing Environment

The application is configured for local blockchain development with:
- Local chain ID: 31338
- RPC URL: `http://localhost:8545` (configurable via `NEXT_PUBLIC_RPC_URL`)
- Test mode with demo functionality enabled
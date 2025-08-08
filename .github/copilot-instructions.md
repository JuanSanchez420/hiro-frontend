# Copilot Instructions for AI Agents

This codebase is a Next.js 15 (App Router) + React 19 frontend for a crypto DeFi agent called "Hiro". It is designed for AI agent-driven workflows, with a focus on modular widgets, context-driven state, and real-time chat interactions.

## Architecture & Key Patterns

- **App Structure:**
  - Root layout: `app/layout.tsx` (navigation, theme, context providers)
  - Providers: `app/providers.tsx` (Wagmi, TanStack Query)
  - Main chat: `app/page.tsx` (Hiro AI assistant)
- **Context:**
  - Global UI state: `app/context/GlobalContext.tsx`
  - Chat prompts: `app/context/PromptsContext.tsx`
  - Portfolio/DeFi data: `app/context/PortfolioContext.tsx`
- **Widgets:**
  - All DeFi actions are modular widgets in `app/components/widgets/`
  - Widget state managed via `GlobalContext.widget`
- **Web3:**
  - Wagmi + Viem for wallet/connectivity (see `app/config.ts`)
  - Local chain ID 31338, RPC at `http://localhost:8545`
- **Styling:**
  - Tailwind CSS, theme toggling via context and `utils/styles.ts`
  - Use `styles.button` etc. from context for consistent UI
- **Drawers:**
  - Left: navigation/menu
  - Right: portfolio/positions
  - Controlled via `GlobalContext.drawerLeftOpen`/`drawerRightOpen`
- **Chat:**
  - Main chat via `MessageBox`, prompt streaming, event-driven updates

## Developer Workflows

- **Start dev server:** `npm run dev` (Turbopack)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test blockchain:** Local chain, test mode enabled
- **API routes:** All backend endpoints in `app/api/`

## Project Conventions

- Use `'use client'` for client components
- Strict TypeScript (ES2020 target)
- React 19 patterns (memoization, hooks)
- Web3: Wagmi v2 + Viem for type safety
- Portfolio and widget types defined in context files
- All UI state and theme handled via context, not props

## Integration Points

- **Wallets:** MetaMask, WalletConnect
- **DeFi:** Aave, Uniswap-style liquidity, portfolio tracking
- **Market Data:** OHLC charts, token prices

## Example: Adding a Widget
1. Create new widget in `app/components/widgets/`
2. Register widget type in context
3. Use context to manage widget state and UI

## References
- `app/context/GlobalContext.tsx`, `app/components/widgets/Widget.tsx`, `app/config.ts`, `utils/styles.ts`
- For chat/AI logic: `app/page.tsx`, `app/context/PromptsContext.tsx`

---

**For questions or unclear conventions, check `CLAUDE.md` and context files.**

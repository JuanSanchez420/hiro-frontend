
# Hiro DeFi Agent Frontend

>This is the Next.js 15 + React 19 frontend for **Hiro**, a modular crypto DeFi agent. It features real-time chat, DeFi widgets, portfolio tracking, and wallet connectivity. Designed for local development with a local blockchain and backend server.

---

## Project Overview

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS
- **DeFi Widgets:** Modular, context-driven, in `app/components/widgets/`
- **Web3:** Wagmi v2 + Viem, MetaMask/WalletConnect, local chain (31338)
- **Backend:** Express server (see `.env` for port)
- **Local Blockchain:** RPC at `http://localhost:8545` (e.g., Anvil, Hardhat, or Foundry)

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd agent-frontend
npm install
# or yarn/pnpm/bun install
```

### 2. Set Up Environment

Copy `.env` and adjust if needed:

```bash
cp .env.example .env
# Edit .env if you want to change ports or addresses
```

**.env defaults:**
- `NEXT_PUBLIC_EXPRESS_URL=http://localhost`
- `NEXT_PUBLIC_EXPRESS_PORT=4000`
- `NEXT_PUBLIC_RPC_URL=http://localhost:8545`
- `NEXT_PUBLIC_HIRO_FACTORY=MUST DEPLOY FIRST (see below)`

### 3. Start Local Blockchain

You need a local Ethereum node running on chain ID 31338 at `http://localhost:8545`.

**Example (Foundry Anvil):**
```bash
npm run fork (on backend service)
make deploy (on backend service, copy that address to front and back .envs)
npm run server (on backend service)
```

### 4. Start Backend (Express)

You must run the backend server (see `.env`):

```bash
# From the backend directory (not included in this repo)
npm install
npm run dev
# Should listen on http://localhost:4000
```

### 5. Start Frontend

```bash
npm run dev
# Open http://localhost:3000
```

---

## Usage

- Connect your wallet (MetaMask, WalletConnect)
- Use DeFi widgets (Aave, Uniswap-style, etc.)
- View portfolio, market data, and interact with Hiro AI chat
- All UI state is managed via React context (see `app/context/`)

---

## Project Structure

- `app/components/widgets/` – Modular DeFi widgets
- `app/context/` – Global, prompts, and portfolio context
- `app/api/` – Backend API routes
- `app/config.ts` – Web3 config (Wagmi, Viem)
- `utils/styles.ts` – Theme/styles helpers

---

## Troubleshooting

- **Chain not detected:** Make sure your local node is running on 31338 and RPC matches `.env`
- **Backend errors:** Ensure Express server is running on the correct port
- **Wallet not connecting:** Use MetaMask or WalletConnect, and switch to the local chain

---

## References

- [Next.js Docs](https://nextjs.org/docs)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [Tailwind CSS](https://tailwindcss.com/)

For project-specific conventions, see `CLAUDE.md` and context files.

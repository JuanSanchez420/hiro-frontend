# Repository Guidelines

## Project Structure & Module Organization
Hiro DeFi front-end built on Next.js 15 App Router. All routable UI lives in `app/`. Root layout `app/layout.tsx` wires navigation, theme, and global providers defined in `app/providers.tsx`. Reusable UI sits under `app/components/`, with DeFi widgets grouped in `app/components/widgets/` (e.g., `SwapWidget`, `LendWidget`). State is centralized in TypeScript contexts inside `app/context/` (Global, Prompts, Messages, Portfolio). Serverless endpoints reside in `app/api/` for portfolio, prices, session, and transaction confirmations. Shared styles and config sit in `app/config.ts`, `tailwind.config.ts`, and `utils/styles.ts`.

## Build, Test, and Development Commands
- `npm run dev` – Launches the development server with Turbopack; ensure the backend and local chain are running first.
- `npm run build` – Compiles the production bundle and runs type checks.
- `npm run start` – Serves the compiled build; use for smoke-testing production mode.
- `npm run lint` – Executes ESLint with the Next.js TypeScript profile; run before every PR.

Set environment variables via `cp .env.example .env`, then update RPC and backend URLs if they differ from defaults.

## Coding Style & Naming Conventions
Use TypeScript React with functional components and hooks. Stick to two-space indentation, single quotes in TypeScript files, and trailing commas where ESLint inserts them. Components and contexts use PascalCase (`PortfolioContext`), hooks use camelCase with a `use` prefix, and files inside `app/components` mirror component names (`SwapWidget.tsx`). Import paths may use the `@/` alias for root-relative modules. Tailwind utility classes should stay ordered from layout → spacing → color for readability.

## Testing Guidelines
Automated tests are not yet enforced; rely on manual validation plus lint checks. When adding tests, place component specs alongside the source as `*.test.tsx` and favor React Testing Library. Always run `npm run lint` and exercise critical flows: wallet connect, prompt submission, widget interactions, and portfolio refresh after blockchain events.

## Commit & Pull Request Guidelines
Commit messages in `git log` follow short, imperative phrases (`removed demo tools`, `drawer rerenders fixed`). Match that style and keep each commit tightly scoped. For PRs, include a succinct summary, impacted screens, required environment changes, and screenshots or clips for UI updates. Link related issues and note manual test steps run.

## Environment & Integration Notes
Development requires a local Ethereum node on chain ID 31338 (e.g., Anvil) and the Express backend at `http://localhost:4000`. Ensure `NEXT_PUBLIC_HIRO_FACTORY` points to the deployed contract before testing on-chain flows.

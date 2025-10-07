

export interface TokensData {
  [symbol: string]: Token;
}


export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isWETH: boolean;
  isNative: boolean;
  logoURI: string;
}

export interface PricesResponse {
  [tokenAddress: string]: OHLCData[];
}

export interface OHLC {
  periodStartUnix: number; // UNIX timestamp in seconds
  open: string;
  high: string;
  low: string;
  close: string;
}

export type WidgetOption = "Swap" | "Earn" | "Autonomous" | "Deposit" | "Withdraw" | "Signup" | "Lend" | "Borrow" | null

export interface Message {
    id: number
    message: string
    type: "user" | "assistant" | "function"
    functionCall?: Record<string, unknown>
    waitingForConfirmation?: boolean
    transactionId?: string
    completed: boolean
}

export type MarketData = {
  symbol: string;
  price: string;
  price24h: string;
  change24h: string;
  rsi: string;
  atr: string;
  trend: string;
  donchian: string;
}

type PoolDetails = {
  address: `0x${string}`
  tickSpacing: number
  token0: Token
  token1: Token
}

type SimpleLiquidityPosition = {
  index: number;
  token0: string;
  token1: string;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  tokensOwed0: string;
  tokensOwed1: string;
};

type AaveUserPosition = {
  token: string;
  balance: string;
  variableDebt: string;
  stableDebt: string;
  depositAPY: string;
  variableBorrowAPY: string;
  stableBorrowAPY: string;
  usageAsCollateral: boolean;
}

export interface Portfolio {
  address: `0x${string}`;
  hiro: `0x${string}`;
  balance: string;
  hiroBalance: string;
  tokens: {
    symbol: string;
    balance: string;
    usdPrice: number;
  }[],
  positions: SimpleLiquidityPosition[]
  aave: AaveUserPosition[]
  timestamp: number;
}
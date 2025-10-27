

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

export interface MessageSession {
    sessionId: string
    timestamp: number
    messageCount: number
    messages: Message[]
}

export type MarketData = {
  symbol: string;
  price: string;
  price24h: string;
  change24h: string;
  hiro: {
    trend: "uptrend" | "downtrend";
    marketState: "trending" | "ranging";
    position: "support" | "resistance" | "pullback" | "mid-channel" | "breakout";
  };
}

type PoolDetails = {
  address: `0x${string}`
  tickSpacing: number
  token0: Token
  token1: Token
}

export type SimpleLiquidityPosition = {
  index: string;
  token0: string;
  token1: string;
  fee: number; // Fee in basis points (100 = 0.01%, 500 = 0.05%, 3000 = 0.30%, 10000 = 1.00%)
  tickLower: number;
  tickUpper: number;
  rangeWidthTicks: number;
  rangeWidthPercent: number;
  liquidity: string;
  tokensOwed0: string;
  tokensOwed1: string;
  apr?: number; // Annual percentage rate based on historical fees (e.g., 0.15 = 15% APR)
  feesUSD?: number; // Total fees earned in USD
  positionValueUSD?: number; // Current position value in USD
  daysElapsed?: number; // Days since position was created
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
  userWalletEthBalance: string;
  tokens: {
    symbol: string;
    balance: string;
    usdPrice: number;
  }[],
  positions: SimpleLiquidityPosition[]
  aave: AaveUserPosition[]
  timestamp: number;
}



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

export type WidgetOption = "Swap" | "Earn" | "Market" | "Autonomous" | "Portfolio" | "Deposit" | "Withdraw" | "Signup" | null

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
  timestamp: number;
}
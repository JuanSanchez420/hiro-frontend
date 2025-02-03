

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

export type WidgetOption = "Swap" | "Earn" | "Market" | "Autonomous" | "Portfolio" | null

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
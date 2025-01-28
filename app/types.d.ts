

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

export type WidgetOption = "Swap" | "Earn" | "Lend" | "Autonomous" | null

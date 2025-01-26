

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
  date: number; // UNIX timestamp in seconds
  open: string;
  high: string;
  low: string;
  close: string;
}

export interface RSIData {
  time: number;
  value: number;
}

export interface ATRData {
  time: number;
  value: number;
}


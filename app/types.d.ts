

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

}

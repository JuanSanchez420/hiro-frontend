import { OHLC, Token } from '../types';
import formatNumber from './formatNumber';
import { calculateHiroChannel, interpretHiroChannel, HiroChannelInterpretation } from './indicators';

const DEFAULT_HIRO_LOOKBACK = 30;
const DEFAULT_HIRO_HOURS = 200;

export interface HiroMarketSnapshot {
  symbol: string;
  price: string;
  price24h: string;
  change24h: string;
  hiro: HiroChannelInterpretation;
}

const defaultMarketSnapshot = (symbol: string): HiroMarketSnapshot => ({
  symbol,
  price: 'N/A',
  price24h: 'N/A',
  change24h: 'N/A',
  hiro: {
    trend: 'downtrend',
    marketState: 'ranging',
    position: 'mid-channel',
  },
});

export interface HiroTakeParams {
  token: Token;
  ohlcData: OHLC[];
  lookback?: number;
}

export const computeHiroMarketSnapshot = ({
  token,
  ohlcData,
  lookback = DEFAULT_HIRO_LOOKBACK,
}: HiroTakeParams): HiroMarketSnapshot => {
  if (ohlcData.length === 0) {
    return defaultMarketSnapshot(token.symbol);
  }

  const lastIndex = ohlcData.length - 1;
  const previousIndex = Math.max(lastIndex - 24, 0);
  const price = Number(ohlcData[lastIndex].close);
  const price24h = Number(ohlcData[previousIndex].close);
  const changeBase = price24h === 0 ? 0 : ((price - price24h) * 100) / price24h;

  const { states } = calculateHiroChannel(ohlcData, lookback);
  const hiro = interpretHiroChannel(states, ohlcData[lastIndex]);

  return {
    symbol: token.symbol,
    price: formatNumber(price),
    price24h: formatNumber(price24h),
    change24h: changeBase.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    hiro,
  };
};

export interface HiroPromptParams {
  token: Token;
  market: HiroMarketSnapshot;
  lookback?: number;
}

export const buildHiroTakePrompt = ({
  token,
  market,
  lookback = DEFAULT_HIRO_LOOKBACK,
}: HiroPromptParams): string => {
  const channelSummary = `Trend: ${market.hiro.trend}, State: ${market.hiro.marketState}, Position: ${market.hiro.position}`;

  return [
    `I'm looking for advice on: ${token.symbol}`,
    '',
    `Current Price: ${market.price}`,
    `24h Change: ${market.change24h}% (from ${market.price24h} to ${market.price})`,
    `Hiro Channel (${lookback}): ${channelSummary}`,
    '',
    'What should I do here?',
  ].join('\n');
};

export const HIRO_DEFAULT_LOOKBACK = DEFAULT_HIRO_LOOKBACK;
export const HIRO_DEFAULT_HOURS = DEFAULT_HIRO_HOURS;

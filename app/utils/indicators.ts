// src/utils/indicators.ts

import { OHLC } from '../types';
/**
 * Calculates the Exponential Moving Average (EMA) for a given OHLC data set.
 * 
 * @param data Array of OHLC data sorted in ascending order.
 * @param period Number of periods for EMA calculation.
 * @returns Array of EMA values with corresponding periodStartUnix
 */
export const calculateEMA = (
  data: OHLC[],
  period: number
): { periodStartUnix: number; value: number }[] => {
  // Validate input
  if (period <= 0) {
      throw new Error("Period must be a positive integer.");
  }

  if (data.length < period) {
      console.warn(
          `Insufficient data to calculate EMA for period ${period}. Required: ${period}, Provided: ${data.length}.`
      );
      return [];
  }

  const ema: { periodStartUnix: number; value: number }[] = [];
  const k = 2 / (period + 1);

  // Initialize EMA with the first closing price
  let emaPrev = Number(data[0].close);
  ema.push({ periodStartUnix: data[0].periodStartUnix, value: parseFloat(emaPrev.toFixed(2)) });

  // Calculate EMA for each subsequent data point
  for (let i = 1; i < data.length; i++) {
      const close = Number(data[i].close);
      const emaCurrent = close * k + emaPrev * (1 - k);
      ema.push({ periodStartUnix: data[i].periodStartUnix, value: parseFloat(emaCurrent.toFixed(2)) });
      emaPrev = emaCurrent;
  }

  return ema;
};

export const interpretEMA = (slow: { periodStartUnix: number; value: number }, fast: { periodStartUnix: number; value: number }, price: number): string => {

  if (price > fast.value && price > slow.value) {
    return 'Strong uptrend';
  } else if (price < fast.value && price < slow.value) {
    return 'Strong downtrend';
  } else if (price > slow.value && price < fast.value) {
    return 'Uptrend';
  } else if (price < slow.value && price > fast.value) {
    return 'Downtrend';
  } else {
    return 'No trend';
  }
}

/**
 * Calculates Relative Strength Index (RSI)
 * @param data Array of OHLCData
 * @param period Number of periods for RSI
 * @returns Array of RSI values with corresponding time
 */
export const calculateRSI = (data: OHLC[], period: number = 14): { periodStartUnix: number; value: number }[] => {
  const gains: number[] = [];
  const losses: number[] = [];
  let avgGain = 0;
  let avgLoss = 0;
  const rsi: { periodStartUnix: number; value: number }[] = [];

  for (let i = 1; i < data.length; i++) {
    const change = Number(data[i].close) - Number(data[i - 1].close);
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    gains.push(gain);
    losses.push(loss);

    if (i === period) {
      avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push({ periodStartUnix: data[i].periodStartUnix, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
    } else if (i > period) {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push({ periodStartUnix: data[i].periodStartUnix, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
    }
    // Before reaching the period, RSI is not defined
  }

  return rsi;
};

export const interpretRSI = (data: { periodStartUnix: number; value: number }[]): string => {
  const rsi = data[0].value;
  const prev = data[1].value;

  if (rsi > 30 && prev < 30) {
    return 'Buy signal';
  } else if (rsi < 70 && prev > 70) {
    return 'Sell signal';
  }

  if (rsi > 70) {
    return 'Overbought';
  } else if (rsi > 50) {
    return "Bullish";
  } else if (rsi < 30) {
    return 'Oversold';
  } else if (rsi < 50) {
    return "Bearish";
  } else {
    return 'Neutral';
  }
}

/**
 * Calculates Average True Range (ATR)
 * @param data Array of OHLCData
 * @param period Number of periods for ATR
 * @returns Array of ATR values with corresponding time
 */
export const calculateATR = (data: OHLC[], period: number = 14): { periodStartUnix: number; value: number }[] => {
  const tr: number[] = [];
  const atr: { periodStartUnix: number; value: number }[] = [];

  const sortedData = data.sort((a, b) => a.periodStartUnix - b.periodStartUnix);

  for (let i = 1; i < sortedData.length; i++) {
    const highLow = Number(sortedData[i].high) - Number(sortedData[i].low);
    const highPrevClose = Math.abs(Number(sortedData[i].high) - Number(sortedData[i - 1].close));
    const lowPrevClose = Math.abs(Number(sortedData[i].low) - Number(sortedData[i - 1].close));
    const trueRange = Math.max(highLow, highPrevClose, lowPrevClose);
    tr.push(trueRange);
  }

  let atrPrev = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  atr.push({ periodStartUnix: data[period].periodStartUnix, value: parseFloat(atrPrev.toFixed(2)) });

  for (let i = period + 1; i < tr.length; i++) {
    atrPrev = (atrPrev * (period - 1) + tr[i]) / period;
    atr.push({ periodStartUnix: data[i].periodStartUnix, value: parseFloat(atrPrev.toFixed(2)) });
  }

  return atr;
};

export const interpretATR = (data: { periodStartUnix: number; value: number }[]): string => {
  const atr = data[0].value;
  const near = data[Math.floor(data.length/2)].value;
  const far = data[data.length-1].value;

  if (atr > near && atr > far) {
    return 'Increasing volatility';
  } else if (atr < near && atr < far) {
    return 'Decreasing volatility';
  } else {
    return 'Stable volatility';
  }
}
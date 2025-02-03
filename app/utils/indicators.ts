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

export const interpretEMA = (ema: { periodStartUnix: number; value: number }, price: number): string => {
  if (price >= ema.value) {
    return 'uptrend';
  } else {
    return 'downtrend';
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

/**
 * Calculates Average True Range (ATR)
 * @param data Array of OHLCData
 * @param period Number of periods for ATR
 * @returns Array of ATR values with corresponding time
 */
export const calculateATR = (data: OHLC[], period: number = 14): { periodStartUnix: number; value: number }[] => {
  const tr: number[] = [];
  const atr: { periodStartUnix: number; value: number }[] = [];

  for (let i = 1; i < data.length; i++) {
    const highLow = Number(data[i].high) - Number(data[i].low);
    const highPrevClose = Math.abs(Number(data[i].high) - Number(data[i - 1].close));
    const lowPrevClose = Math.abs(Number(data[i].low) - Number(data[i - 1].close));
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
  const atr = data[data.length - 1].value;
  const near = data[Math.floor(data.length / 2)].value;
  const far = data[0].value;

  if (atr > near && atr > far) {
    return 'increasing volatility';
  } else if (atr < near && atr < far) {
    return 'decreasing volatility';
  } else {
    return 'stable volatility';
  }
}

/**
 * Calculates Donchian Channel
 * @param data Array of OHLC data (ascending order)
 * @param period Number of periods for Donchian channel
 * @returns Array of Donchian channel values with corresponding periodStartUnix
 */
export const calculateDonchianChannel = (
  data: OHLC[],
  period: number = 30
): {
  periodStartUnix: number;
  upper: number;
  lower: number;
}[] => {
  if (period <= 0) {
    throw new Error("Period must be a positive integer.");
  }

  if (data.length < period) {
    console.warn(`Insufficient data to calculate Donchian channel. Required: ${period}, Provided: ${data.length}.`);
    return [];
  }

  const donchian: { periodStartUnix: number; upper: number; lower: number }[] = [];

  // Start computing Donchian channel once we have at least `period` data points
  for (let i = period - 1; i < data.length; i++) {
    // Slice out the last `period` data points to find highest high & lowest low
    const windowData = data.slice(i - period + 1, i + 1);

    const highestHigh = Math.max(...windowData.map((d) => Number(d.high)));
    const lowestLow = Math.min(...windowData.map((d) => Number(d.low)));

    donchian.push({
      periodStartUnix: data[i].periodStartUnix,
      upper: parseFloat(highestHigh.toFixed(2)),
      lower: parseFloat(lowestLow.toFixed(2))
    });
  }

  return donchian;
};

/**
 * Interprets the Donchian channel relative to the current price.
 *
 * @param channel Array of Donchian channel data
 * @param price Current price
 */
export const interpretDonchianChannel = (
  channel: { periodStartUnix: number; upper: number; lower: number }[],
  currentBar: OHLC
): string => {
  if (channel.length === 0) {
    return "No Donchian data";
  }

  const { upper, lower } = channel[channel.length - 1];

  if (Number(currentBar.high) >= upper) {
    return "price at resistance";
  } else if (Number(currentBar.low) <= lower) {
    return "price at support";
  } else {
    return "price within range";
  }
};
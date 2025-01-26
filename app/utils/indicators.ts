// src/utils/indicators.ts

import { OHLC } from '../types';

/**
 * Calculates Exponential Moving Average (EMA)
 * @param data Array of OHLCData
 * @param period Number of periods for EMA
 * @returns Array of EMA values with corresponding time
 */
export const calculateEMA = (data: OHLC[], period: number): { time: number; value: number }[] => {
  const ema: { time: number; value: number }[] = [];
  const k = 2 / (period + 1);
  
  let emaPrev = Number(data[0].close); // Initialize EMA with the first close price

  ema.push({ time: data[0].date, value: Number(emaPrev) });

  for (let i = 1; i < data.length; i++) {
    const close = data[i].close;
    const emaCurrent = Number(close) * k + Number(emaPrev) * (1 - k);
    ema.push({ time: data[i].date, value: parseFloat(emaCurrent.toFixed(2)) });
    emaPrev = emaCurrent;
  }

  return ema;
};

/**
 * Calculates Relative Strength Index (RSI)
 * @param data Array of OHLCData
 * @param period Number of periods for RSI
 * @returns Array of RSI values with corresponding time
 */
export const calculateRSI = (data: OHLC[], period: number = 14): { time: number; value: number }[] => {
  const gains: number[] = [];
  const losses: number[] = [];
  let avgGain = 0;
  let avgLoss = 0;
  const rsi: { time: number; value: number }[] = [];

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
      rsi.push({ time: data[i].date, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
    } else if (i > period) {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push({ time: data[i].date, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
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
export const calculateATR = (data: OHLC[], period: number = 14): { time: number; value: number }[] => {
  const tr: number[] = [];
  const atr: { time: number; value: number }[] = [];

  for (let i = 1; i < data.length; i++) {
    const highLow = Number(data[i].high) - Number(data[i].low);
    const highPrevClose = Math.abs(Number(data[i].high) - Number(data[i - 1].close));
    const lowPrevClose = Math.abs(Number(data[i].low) - Number(data[i - 1].close));
    const trueRange = Math.max(highLow, highPrevClose, lowPrevClose);
    tr.push(trueRange);
  }

  let atrPrev = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  atr.push({ time: data[period].date, value: parseFloat(atrPrev.toFixed(2)) });

  for (let i = period + 1; i < tr.length; i++) {
    atrPrev = (atrPrev * (period - 1) + tr[i]) / period;
    atr.push({ time: data[i].date, value: parseFloat(atrPrev.toFixed(2)) });
  }

  return atr;
};
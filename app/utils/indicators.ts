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

/**
 * Hiro Channel State - represents the market state at each bar
 */
export interface HiroChannelState {
  periodStartUnix: number;
  top: number;
  bottom: number;
  basis: number;
  width: number;
  extreme: boolean;
  expansion: boolean;
  expansionUp: boolean;
  expansionDown: boolean;
  cross: boolean;
  trend: boolean; // true = uptrend, false = downtrend
  trendStart: boolean;
  trendEnd: boolean;
  trending: boolean;
  trendFlip: boolean;
  rangeStart: boolean;
}

/**
 * Hiro Channel Signals - entry/exit signals for volatility system
 */
export interface HiroChannelSignals {
  periodStartUnix: number;
  longEntry: boolean;
  shortEntry: boolean;
  exit: boolean;
  volatilityLongEntry: boolean;
  volatilityShortEntry: boolean;
  volatilityExit: boolean;
}

/**
 * Hiro Channel Interpretation - structured market analysis
 */
export interface HiroChannelInterpretation {
  trend: "uptrend" | "downtrend";
  marketState: "trending" | "ranging";
  position: "support" | "resistance" | "pullback" | "mid-channel" | "breakout";
}

/**
 * Calculates the Hiro Channel - an advanced Donchian Channel with trend and volatility detection
 *
 * @param data Array of OHLC data sorted in ascending order
 * @param length Number of periods for the channel (default 30)
 * @param entryType System type: "None", "Trend", "Trend - Long Only", "Volatility", "Volatility - Long Only"
 * @returns Object containing channel states and trading signals
 */
export const calculateHiroChannel = (
  data: OHLC[],
  length: number = 30,
  entryType: "None" | "Trend" | "Trend - Long Only" | "Volatility" | "Volatility - Long Only" = "None"
): {
  states: HiroChannelState[];
  signals: HiroChannelSignals[];
} => {
  if (length <= 0) {
    throw new Error("Length must be a positive integer.");
  }

  if (data.length < length) {
    console.warn(`Insufficient data for Hiro Channel. Required: ${length}, Provided: ${data.length}.`);
    return { states: [], signals: [] };
  }

  const states: HiroChannelState[] = [];
  const signals: HiroChannelSignals[] = [];

  // Track bars since last event for state detection
  let lastExpansionUpBar = -Infinity;
  let lastExpansionDownBar = -Infinity;
  let lastTrendStartBar = -Infinity;
  let lastTrendEndBar = -Infinity;

  // Process each bar
  for (let i = 0; i < data.length; i++) {
    const currentLength = Math.min(length, i + 1);
    const windowStart = i - currentLength + 1;
    const windowData = data.slice(windowStart, i + 1);

    // Calculate Donchian Channel
    const top = Math.max(...windowData.map(d => Number(d.high)));
    const bottom = Math.min(...windowData.map(d => Number(d.low)));
    const basis = (top + bottom) / 2;

    // Calculate channel width (Hiro Channel Width)
    const width = (top - bottom) / 2;

    // Calculate hl2 (high-low average for current bar)
    const hl2 = (Number(data[i].high) + Number(data[i].low)) / 2;

    // Detect extreme (price touches channel boundary)
    const extreme = Number(data[i].high) === top || Number(data[i].low) === bottom;

    // Find highest width in the window
    const widthHistory = states.slice(Math.max(0, states.length - currentLength + 1));
    const highestWidth = widthHistory.length > 0
      ? Math.max(width, ...widthHistory.map(s => s.width))
      : width;

    // Detect expansion (width at highest and price at extreme)
    const expansion = width === highestWidth && extreme;
    const expansionUp = expansion && Number(data[i].high) === top;
    const expansionDown = expansion && Number(data[i].low) === bottom;

    // Update expansion tracking
    if (expansionUp) lastExpansionUpBar = i;
    if (expansionDown) lastExpansionDownBar = i;

    // Detect cross (hl2 crosses basis)
    const prevHl2 = i > 0 ? (Number(data[i - 1].high) + Number(data[i - 1].low)) / 2 : hl2;
    const prevBasis = i > 0 && states.length > 0 ? states[states.length - 1].basis : basis;
    const cross = (prevHl2 <= prevBasis && hl2 > basis) || (prevHl2 >= prevBasis && hl2 < basis);

    // Determine trend (true = uptrend, false = downtrend)
    const barsSinceExpansionUp = i - lastExpansionUpBar;
    const barsSinceExpansionDown = i - lastExpansionDownBar;
    const trend = barsSinceExpansionUp < barsSinceExpansionDown;

    // Detect trend start/end
    const trendStart = expansionUp || expansionDown;
    if (trendStart) lastTrendStartBar = i;

    const barsSinceTrendStart = i - lastTrendStartBar;
    const barsSinceTrendEnd = i - lastTrendEndBar;
    const trending = barsSinceTrendStart < barsSinceTrendEnd;

    const prevTrending = i > 0 && states.length > 0 ? states[states.length - 1].trending : false;
    const trendEnd = !trendStart && cross;
    if (trendEnd && prevTrending) lastTrendEndBar = i;

    // Detect trend flip
    const prevTrend = i > 0 && states.length > 0 ? states[states.length - 1].trend : trend;
    const trendFlip = trend !== prevTrend;

    // Detect range start
    const rangeStart = (trendEnd && prevTrending) || (trendFlip && prevTrending);

    // Store state
    const state: HiroChannelState = {
      periodStartUnix: data[i].periodStartUnix,
      top: parseFloat(top.toFixed(2)),
      bottom: parseFloat(bottom.toFixed(2)),
      basis: parseFloat(basis.toFixed(2)),
      width: parseFloat(width.toFixed(2)),
      extreme,
      expansion,
      expansionUp,
      expansionDown,
      cross,
      trend,
      trendStart,
      trendEnd,
      trending,
      trendFlip,
      rangeStart
    };
    states.push(state);

    // Calculate signals for volatility system
    const volatilityExit =
      (entryType === "Volatility" && rangeStart) ||
      (entryType === "Volatility - Long Only" && ((trend && rangeStart) || (prevTrending && trendFlip && expansionDown)));

    const volatilityLongEntry =
      (entryType === "Volatility" || entryType === "Volatility - Long Only") &&
      expansionUp && (!prevTrending || trendFlip);

    const volatilityShortEntry =
      entryType === "Volatility" && expansionDown && (!prevTrending || trendFlip);

    const signal: HiroChannelSignals = {
      periodStartUnix: data[i].periodStartUnix,
      longEntry: volatilityLongEntry,
      shortEntry: volatilityShortEntry,
      exit: volatilityExit,
      volatilityLongEntry,
      volatilityShortEntry,
      volatilityExit
    };
    signals.push(signal);
  }

  return { states, signals };
};

/**
 * Interprets the current Hiro Channel state with detailed market analysis
 *
 * @param states Array of Hiro Channel states
 * @param currentBar Current OHLC bar
 * @returns Structured interpretation of market state
 */
export const interpretHiroChannel = (
  states: HiroChannelState[],
  currentBar: OHLC
): HiroChannelInterpretation => {
  // Default fallback for insufficient data
  if (states.length === 0) {
    return {
      trend: "downtrend",
      marketState: "ranging",
      position: "mid-channel"
    };
  }

  const current = states[states.length - 1];
  const hl2 = (Number(currentBar.high) + Number(currentBar.low)) / 2;

  // Step 1: Determine trend direction
  const trend: "uptrend" | "downtrend" = current.trend ? "uptrend" : "downtrend";

  // Step 2: Determine market state
  const marketState: "trending" | "ranging" = current.trending ? "trending" : "ranging";

  // Step 3: Calculate price position metrics
  const distanceFromTop = current.top - hl2;
  const distanceFromBottom = hl2 - current.bottom;
  const percentFromTop = (distanceFromTop / current.width) * 100;
  const percentFromBottom = (distanceFromBottom / current.width) * 100;

  // Step 4: Determine position based on market state and trend
  let position: "support" | "resistance" | "pullback" | "mid-channel" | "breakout";

  // Check for breakout first (highest priority)
  const isBreakout = (trend === "uptrend" && current.expansionUp) ||
                     (trend === "downtrend" && current.expansionDown);

  if (isBreakout) {
    position = "breakout";
  } else if (marketState === "trending") {
    // In trending markets, determine position based on trend direction
    const isNearChannelEdge = (trend === "uptrend" && percentFromTop <= 25) ||
                               (trend === "downtrend" && percentFromBottom <= 25);
    const isPullback = (trend === "uptrend" && percentFromTop > 25) ||
                       (trend === "downtrend" && percentFromBottom > 25);

    if (isPullback) {
      position = "pullback";
    } else if (trend === "uptrend" && isNearChannelEdge) {
      position = "resistance";
    } else if (trend === "downtrend" && isNearChannelEdge) {
      position = "support";
    } else {
      position = "mid-channel";
    }
  } else {
    // In ranging markets, use support/resistance based on proximity to boundaries
    const isNearTop = percentFromTop < 10;
    const isNearBottom = percentFromBottom < 10;

    if (isNearTop) {
      position = "resistance";
    } else if (isNearBottom) {
      position = "support";
    } else {
      position = "mid-channel";
    }
  }

  return {
    trend,
    marketState,
    position
  };
};
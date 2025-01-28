// src/components/CombinedChart.tsx

import React, { useEffect, useState } from 'react';
import CandlestickChart from './CandlestickChart';
import { OHLC, PricesResponse, Token } from '../types';
import { calculateATR, calculateEMA, calculateRSI, interpretATR, interpretEMA, interpretRSI } from '../utils/indicators';
import formatNumber from '../utils/formatNumber';
import { styles } from '../utils/styles';

interface CombinedChartProps {
  token: Token;
  hours: number;
}

const CombinedChart: React.FC<CombinedChartProps> = ({ token, hours }) => {
  const [ohlcData, setOhlcData] = useState<OHLC[]>([]);
  const [ema50Data, setEma50Data] = useState<{ periodStartUnix: number; value: number }[]>([]);
  const [ema200Data, setEma200Data] = useState<{ periodStartUnix: number; value: number }[]>([]);
  const [rsiData, setRsiData] = useState<{ periodStartUnix: number, value: number }[]>([]);
  const [atrData, setAtrData] = useState<{ periodStartUnix: number, value: number }[]>([]);
  const [visibleRange, setVisibleRange] = useState<{ from: number; to: number } | null>(null);

  // Function to handle time scale changes from the CandlestickChart
  const handleTimeScaleChange = (newVisibleRange: { from: number; to: number }) => {
    console.log('New visible range:', newVisibleRange);
    setVisibleRange(newVisibleRange);
  };

  // Effect to fetch OHLC data and calculate indicators
  useEffect(() => {
    const fetchOHLCData = async () => {
      try {
        const response = await fetch(
          `/api/prices?tokens=${encodeURIComponent(token.address)}&hours=${hours}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData: PricesResponse = await response.json();

        // Extract OHLC data for the specific token
        const fetchedOhlcData: OHLC[] = responseData[token.address.toLowerCase()];

        if (!fetchedOhlcData) {
          throw new Error('No data found for the specified token.');
        }

        // Calculate indicators
        const ema50 = calculateEMA(fetchedOhlcData, 50);
        const ema200 = calculateEMA(fetchedOhlcData, 150);
        const rsi = calculateRSI(fetchedOhlcData, 14);
        const atr = calculateATR(fetchedOhlcData, 14);

        setOhlcData(fetchedOhlcData);
        setEma50Data(ema50);
        setEma200Data(ema200);
        setRsiData(rsi);
        setAtrData(atr);
      } catch (error) {
        console.error('Error fetching or processing OHLC data:', error);
      }
    };

    fetchOHLCData();
  }, [token, hours]);

  return (
    <div>
      <CandlestickChart
        ohlcData={ohlcData}
        emaData={ema200Data}
        visibleRange={visibleRange}
        onTimeScaleChange={handleTimeScaleChange}
        label={token.symbol}
      />
      {ema50Data.length > 0 && ema200Data.length > 0 && (
        <div>Trend: {interpretEMA(ema50Data[0], ema200Data[0], Number(ohlcData[0].close))}</div>
      )}
      {rsiData.length > 0 && (
        <div>RSI: {interpretRSI(rsiData)}, {rsiData[0].value}</div>
      )}
      {rsiData.length > 0 && (
        <div>ATR: {interpretATR(atrData)}, {`${formatNumber(atrData[0].value * 100 / Number(ohlcData[0].close))}% hourly price volatility`}</div>
      )}
      <div className='flex'>
        <button className={styles.button}>Swap</button>
        <button className={styles.button}>Earn</button>
        <button className={styles.button}>Suggest</button>
      </div>
    </div>
  );
};

export default CombinedChart;
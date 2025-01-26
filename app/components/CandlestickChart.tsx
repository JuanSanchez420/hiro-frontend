// src/components/CandlestickChart.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickData,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts';
import { OHLC, PricesResponse, RSIData, ATRData } from '../types';
import { calculateEMA, calculateRSI, calculateATR } from '../utils/indicators';
import RSIChart from './RSIChart';
import ATRChart from './ATRChart';

interface CandlestickChartProps {
  token: string;
  hours: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ token, hours }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [rsiData, setRsiData] = useState<RSIData[]>([]);
  const [atrData, setAtrData] = useState<ATRData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Initialize the chart
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400, // Adjust height as needed
        layout: {
          textColor: '#000',
        },
        grid: {
          vertLines: {
            color: '#eee',
          },
          horzLines: {
            color: '#eee',
          },
        },
        timeScale: {
          borderColor: '#ccc',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Add candlestick series
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#4CAF50',
        downColor: '#F44336',
        borderDownColor: '#F44336',
        borderUpColor: '#4CAF50',
        wickDownColor: '#F44336',
        wickUpColor: '#4CAF50',
      });

      // Add EMA line series
      emaSeriesRef.current = chartRef.current.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
      });

      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        chartRef.current?.remove();
      };
    }
  }, []);

  useEffect(() => {
    const fetchOHLC = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/prices?tokens=${encodeURIComponent(token)}&hours=${hours}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData: PricesResponse = await response.json();

        // Extract OHLC data for the specific token
        const OHLC: OHLC[] = responseData[token.toLowerCase()];

        if (!OHLC) {
          throw new Error('No data found for the specified token.');
        }

        // Sort data in ascending order (oldest first)
        OHLC.sort((a, b) => a.date - b.date);

        // Transform data to CandlestickData format
        const chartData: CandlestickData[] = OHLC.map((item) => ({
          time: item.date as Time,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        }));

        // Set data to the candlestick series
        candlestickSeriesRef.current?.setData(chartData);

        // Calculate EMA (e.g., 10-period)
        const emaData = calculateEMA(OHLC, 200);
        const transformedEmaData = emaData.map((item) => ({
          time: item.time as Time,
          value: item.value,
        }));
        emaSeriesRef.current?.setData(transformedEmaData);

        // Calculate RSI (14-period by default)
        const calculatedRSI = calculateRSI(OHLC, 14);
        setRsiData(calculatedRSI);

        // Calculate ATR (14-period by default)
        const calculatedATR = calculateATR(OHLC, 14);
        setAtrData(calculatedATR);

        // Adjust the time scale to fit the data
        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error('Error fetching OHLC data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOHLC();
  }, [token, hours]);

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            Loading Chart...
          </div>
        )}
        <div
          ref={chartContainerRef}
          style={{ width: '100%', height: '400px' }}
        />
      </div>

      {/* RSI Chart */}
      {rsiData.length > 0 && (
        <RSIChart rsiData={rsiData} />
      )}

      {/* ATR Chart */}
      {atrData.length > 0 && (
        <ATRChart atrData={atrData} />
      )}
    </div>
  );
};

export default CandlestickChart;
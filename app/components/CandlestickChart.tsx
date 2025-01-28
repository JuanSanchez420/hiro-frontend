// src/components/CandlestickChart.tsx

import React, { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickData,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts';
import { OHLC } from '../types';

interface CandlestickChartProps {
  ohlcData: OHLC[];
  emaData: { periodStartUnix: number; value: number }[];
  visibleRange: { from: number; to: number } | null;
  onTimeScaleChange: (range: { from: number; to: number }) => void;
  label: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  ohlcData,
  emaData,
  visibleRange,
  onTimeScaleChange,
  label,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Initialize the chart
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 200,
        layout: {
          textColor: '#000',
        },
        grid: {
          vertLines: { color: '#eee' },
          horzLines: { color: '#eee' },
        },
        timeScale: {
          borderColor: '#ccc',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#AAAAAA', // Light gray for bullish candles
        downColor: '#555555', // Dark gray for bearish candles
        borderUpColor: '#AAAAAA',
        borderDownColor: '#555555',
        wickUpColor: '#AAAAAA',
        wickDownColor: '#555555',
    });

      // Add EMA line series
      emaSeriesRef.current = chartRef.current.addLineSeries({
        color: '#555555',
        lineWidth: 2,
      });

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      }

      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        chartRef.current?.remove();
      };
    }
  }, [onTimeScaleChange]);

  useEffect(() => {
    if (candlestickSeriesRef.current && ohlcData.length > 0) {
      // Transform OHLCData to CandlestickData
      const transformedData: CandlestickData[] = ohlcData.map((item) => ({
        time: item.periodStartUnix as Time,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
      }));

      // Log the transformed data for debugging
      console.log('Setting Candlestick Data:', transformedData);

      candlestickSeriesRef.current.setData(transformedData);
    }
  }, [ohlcData]);

  useEffect(() => {
    if (emaSeriesRef.current && emaData.length > 0) {
      // Transform EMA data to LineData
      const transformedEMAData = emaData.map((item) => ({
        time: item.periodStartUnix as Time,
        value: item.value,
      }));

      // Log the transformed EMA data for debugging
      console.log('Setting EMA Data:', transformedEMAData);

      emaSeriesRef.current.setData(transformedEMAData);
    }
  }, [emaData]);

  useEffect(() => {
    if (chartRef.current && visibleRange) {
      console.log('Setting visible range:', visibleRange);
      chartRef.current.timeScale().setVisibleLogicalRange(visibleRange);
    }
  }, [visibleRange]);

  return (
    <div 
    className='relative w-full h-[200px]'>
      <div
        className='absolute top-0 left-0 z-10 bg-white bg-opacity-80 p-2 rounded font-bold text-black'
      >
        {label}
      </div>
      <div
        ref={chartContainerRef}
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  );
};

export default CandlestickChart;
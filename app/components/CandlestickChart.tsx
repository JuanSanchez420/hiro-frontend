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
  dcData: { periodStartUnix: number; upper: number; lower: number }[];
  label: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  ohlcData,
  emaData,
  dcData,
  label,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const dcUpperSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const dcLowerSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Initialize the chart
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
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
        upColor: '#05df72',    // Tailwind green-500
        downColor: '#ff6467',  // Tailwind red-500
        borderUpColor: '#05df72',
        borderDownColor: '#ff6467',
        wickUpColor: '#05df72',
        wickDownColor: '#ff6467',
      });
      
      emaSeriesRef.current = chartRef.current.addLineSeries({
        color: '#3B82F6', // Tailwind blue-500
        lineWidth: 2,
      });
      
      dcUpperSeriesRef.current = chartRef.current.addLineSeries({
        color: '#6b7280', // Tailwind purple-500
        lineWidth: 2,
      });
      
      dcLowerSeriesRef.current = chartRef.current.addLineSeries({
        color: '#6b7280', // Tailwind purple-500
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
  }, []);

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

      candlestickSeriesRef.current.setData(transformedData);
    }
  }, [ohlcData]);

  useEffect(() => {
    if (emaSeriesRef.current && emaData.length > 0) {

      const transformedEMA50Data = emaData.map((item) => ({
        time: item.periodStartUnix as Time,
        value: item.value,
      }));

      emaSeriesRef.current.setData(transformedEMA50Data);
    }
  }, [emaData]);

  useEffect(() => {
    if (dcUpperSeriesRef.current && dcLowerSeriesRef.current && dcData.length > 0) {
      const transformedDCData = dcData.map((item) => ({
        time: item.periodStartUnix as Time,
        value: item.upper,
      }));

      dcUpperSeriesRef.current.setData(transformedDCData);

      const transformedDCDataLower = dcData.map((item) => ({
        time: item.periodStartUnix as Time,
        value: item.lower,
      }));

      dcLowerSeriesRef.current.setData(transformedDCDataLower);
    }
  }, [dcData]);

  return (
    <div
      className='relative w-full h-[400px]'>
      <div
        className='absolute top-0 left-0 z-10 bg-opacity-80 p-2 rounded font-bold text-black'
      >
        {label}
      </div>
      <div
        ref={chartContainerRef}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default CandlestickChart;
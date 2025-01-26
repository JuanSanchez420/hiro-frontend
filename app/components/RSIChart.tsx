// src/components/RSIChart.tsx

import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineData, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { RSIData } from '../types';

interface RSIChartProps {
  rsiData: RSIData[];
}

const RSIChart: React.FC<RSIChartProps> = ({ rsiData }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 150, // Smaller height for RSI
        layout: {
          textColor: '#000',
        },
        grid: {
          vertLines: { color: '#eee' },
          horzLines: { color: '#eee' },
        },
        rightPriceScale: {
          visible: true,
          borderColor: '#ccc',
        },
        timeScale: {
          borderColor: '#ccc',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Add RSI line series
      rsiSeriesRef.current = chartRef.current.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
      });

      // Add horizontal lines for RSI thresholds (30 and 70)
      chartRef.current.addLineSeries({
        color: '#FF0000',
        lineWidth: 1,
        lineStyle: 2, // Dashed line
      }).setData([
        { time: rsiData.length > 0 ? rsiData[0].time as Time : 0 as Time, value: 30 },
        { time: rsiData.length > 0 ? rsiData[rsiData.length - 1].time as Time : 0 as Time, value: 30 },
      ]);

      chartRef.current.addLineSeries({
        color: '#FF0000',
        lineWidth: 1,
        lineStyle: 2, // Dashed line
      }).setData([
        { time: rsiData.length > 0 ? rsiData[0].time as Time : 0 as Time, value: 70 },
        { time: rsiData.length > 0 ? rsiData[rsiData.length - 1].time as Time : 0 as Time, value: 70 },
      ]);

      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        chartRef.current?.remove();
      };
    }
  }, [rsiData]);

  useEffect(() => {
    if (rsiSeriesRef.current) {
      const transformedData: LineData[] = rsiData.map((item) => ({
        time: item.time as Time,
        value: item.value,
      }));
      rsiSeriesRef.current.setData(transformedData);
      setIsLoading(false);
    }
  }, [rsiData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '150px', marginTop: '20px' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '5px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          Loading RSI...
        </div>
      )}
      <div
        ref={chartContainerRef}
        style={{ width: '100%', height: '150px' }}
      />
    </div>
  );
};

export default RSIChart;
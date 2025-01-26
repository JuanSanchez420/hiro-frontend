// src/components/ATRChart.tsx

import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineData, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { ATRData } from '../types';

interface ATRChartProps {
  atrData: ATRData[];
}

const ATRChart: React.FC<ATRChartProps> = ({ atrData }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const atrSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 150, // Smaller height for ATR
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

      // Add ATR line series
      atrSeriesRef.current = chartRef.current.addLineSeries({
        color: '#FF9800',
        lineWidth: 2,
      });

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
  }, [atrData]);

  useEffect(() => {
    if (atrSeriesRef.current) {
      const transformedData: LineData[] = atrData.map((item) => ({
        time: item.time as Time,
        value: item.value,
      }));
      atrSeriesRef.current.setData(transformedData);
      setIsLoading(false);
    }
  }, [atrData]);

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
          Loading ATR...
        </div>
      )}
      <div
        ref={chartContainerRef}
        style={{ width: '100%', height: '150px' }}
      />
    </div>
  );
};

export default ATRChart;
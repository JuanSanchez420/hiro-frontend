import React, { useEffect, useMemo, useRef, useState } from 'react';
import CandlestickChart from './CandlestickChart';
import { OHLC, PricesResponse, Token } from '../types';
import { calculateATR, calculateDonchianChannel, calculateEMA, calculateRSI, interpretATR, interpretDonchianChannel, interpretEMA } from '../utils/indicators';
import formatNumber from '../utils/formatNumber';
import tokens from "../utils/tokens.json";
import MarketStats from './MarketStats';
import { Spinner } from './Spinner';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '../context/GlobalContext';
import { usePromptsContext } from '../context/PromptsContext';

interface TokenDataProps {
  token: Token;
  hours: number;
  exit: () => void;
}

const TokenData: React.FC<TokenDataProps> = ({ token, hours, exit }) => {
  const account = useAccount();
  const didFetch = useRef(false);
  const { addPrompt, } = usePromptsContext();
  const { setWidget, setDrawerLeftOpen, styles } = useGlobalContext();
  const [ohlcData, setOhlcData] = useState<OHLC[]>([]);
  const [emaData, setEmaData] = useState<{ periodStartUnix: number; value: number }[]>([]);
  const [rsiData, setRsiData] = useState<{ periodStartUnix: number, value: number }[]>([]);
  const [atrData, setAtrData] = useState<{ periodStartUnix: number, value: number }[]>([]);
  const [dcData, setDcData] = useState<{ periodStartUnix: number, upper: number, lower: number }[]>([]);
  const WETH = tokens['WETH'];

  const disabled = ohlcData.length === 0 || rsiData.length === 0 || atrData.length === 0 || emaData.length === 0;

  const market = useMemo(() => {
    if (ohlcData.length === 0 || rsiData.length === 0 || atrData.length === 0 || emaData.length === 0) {
      return {
        symbol: token.symbol,
        price: 'N/A',
        price24h: 'N/A',
        change24h: 'N/A',
        rsi: "0",
        atr: "0",
        trend: 'N/A',
        donchian: 'N/A'
      };
    }
    const price = Number(ohlcData[ohlcData.length - 1].close);
    const price24h = Number(ohlcData[ohlcData.length - 24].close);
    const rsi = rsiData[rsiData.length - 1].value.toString();
    const atr = interpretATR(atrData);
    const trend = interpretEMA(emaData[emaData.length - 1], price);
    const change24h = ((price - price24h) * 100 / price24h).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return {
      symbol: token.symbol,
      price: formatNumber(price),
      price24h: formatNumber(price24h),
      change24h,
      rsi,
      atr,
      trend,
      donchian: interpretDonchianChannel(dcData, ohlcData[ohlcData.length - 1])
    };
  }, [ohlcData, rsiData, atrData, emaData, dcData, token]);

  const handleHirosTake = () => {
    setWidget(null);
    setDrawerLeftOpen(false);
    addPrompt(`I'm looking for advice on: ${token.symbol}

      EMA (200): ${market.trend}
      RSI (14): ${market.rsi}
      ATR (14): ${market.atr}
      Donchian Channel (30): ${market.donchian}
      24 hour change: ${market.change24h}%, from a price of ${market.price24h} to its current price ${market.price}

      What should I do here?`);
  }

  // Effect to fetch OHLC data and calculate indicators
  useEffect(() => {
    const fetchOHLCData = async () => {
      try {
        didFetch.current = true;
        const response = await fetch(
          `/api/prices?tokens=${encodeURIComponent(token.isNative ? WETH.address : token.address)}&hours=${hours}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData: PricesResponse = await response.json();

        // Extract OHLC data for the specific token
        const fetchedOhlcData: OHLC[] = responseData[token.isNative ? WETH.address.toLowerCase() : token.address.toLowerCase()];

        if (!fetchedOhlcData) {
          throw new Error('No data found for the specified token.');
        }

        // Calculate indicators
        const ema = calculateEMA(fetchedOhlcData, 200);
        const rsi = calculateRSI(fetchedOhlcData, 14);
        const atr = calculateATR(fetchedOhlcData, 14);
        const dc = calculateDonchianChannel(fetchedOhlcData, 30);

        setOhlcData(fetchedOhlcData);
        setEmaData(ema);
        setRsiData(rsi);
        setAtrData(atr);
        setDcData(dc);
      } catch (error) {
        console.error('Error fetching or processing OHLC data:', error);
      }
    };

    if (!didFetch.current) fetchOHLCData();
  }, [token, hours, WETH]);

  return disabled ? <Spinner /> : (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{token.symbol}</h2>
        <div className="text-right">
          <div className="text-3xl font-bold">{market.price}</div>
          <div className={`text-sm font-medium ${Number(market.change24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(market.change24h) >= 0 ? '+' : ''}{market.change24h}% (24h)
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
        <CandlestickChart
          ohlcData={ohlcData}
          emaData={emaData}
          dcData={dcData}
          label={token.symbol}
        />
      </div>

      {/* Technical Indicators Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
        <MarketStats market={market} />
      </div>

      {/* Actions Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {account?.isConnected && (
            <>
              <button
                className="bg-emerald-500 text-white font-medium py-3 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
                onClick={() => setWidget('Swap')}
              >
                Swap
              </button>
              <button
                className="bg-emerald-500 text-white font-medium py-3 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
                onClick={() => setWidget('Earn')}
              >
                Earn
              </button>
              <button
                className="bg-emerald-500 text-white font-medium py-3 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
                onClick={() => setWidget('Autonomous')}
              >
                Autonomous
              </button>
            </>
          )}
          <button
            className="bg-blue-500 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            onClick={handleHirosTake}
          >
            Hiro&apos;s Take
          </button>
          <button
            className={`${styles.button} font-medium py-3 px-4`}
            onClick={() => exit()}
          >
            Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenData;
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
  const { setWidget, setDrawerRightOpen, styles } = useGlobalContext();
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
    setDrawerRightOpen(false);
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

  return (disabled ? <Spinner /> :
    <div>
      <CandlestickChart
        ohlcData={ohlcData}
        emaData={emaData}
        dcData={dcData}
        label={token.symbol}
      />
      <MarketStats market={market} />
      <div className='grid grid-cols-2 gap-1 mt-3'>
        <button className={`${styles.button} ${account?.isConnected ? '' : 'hidden'}`} onClick={() => {
          setWidget('Swap')
        }}>Swap</button>
        <button className={`${styles.button} ${account?.isConnected ? '' : 'hidden'}`} onClick={() => setWidget('Earn')}>Earn</button>
        <button className={`${styles.button} ${account?.isConnected ? '' : 'hidden'}`} onClick={() => setWidget('Autonomous')}>Autonomous</button>
        <button className={styles.button} onClick={handleHirosTake}>Hiro&apos;s Take</button>
        <button className={styles.button} onClick={() => exit()}>Portfolio</button>
      </div>
    </div>
  );
};

export default TokenData;
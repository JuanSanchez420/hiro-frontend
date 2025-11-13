import React, { useEffect, useMemo, useRef, useState } from 'react';
import CandlestickChart from './CandlestickChart';
import { OHLC, PricesResponse, Token } from '../types';
import { calculateHiroChannel } from '../utils/indicators';
import tokens from "../utils/tokens.json";
import MarketStats from './MarketStats';
import { Spinner } from './Spinner';
import { useAccount } from 'wagmi';
import { useDrawerContext, useThemeContext, useWidgetContext } from '../context/GlobalContext';
import { usePromptsContext } from '../context/PromptsContext';
import { buildHiroTakePrompt, computeHiroMarketSnapshot, HIRO_DEFAULT_LOOKBACK } from '../utils/hiroTake';

interface TokenDataProps {
  token: Token;
  hours: number;
  exit: () => void;
}

const HIRO_LOOKBACK = HIRO_DEFAULT_LOOKBACK;

const TokenData: React.FC<TokenDataProps> = ({ token, hours, exit }) => {
  const account = useAccount();
  const didFetch = useRef(false);
  const { addPrompt, } = usePromptsContext();
  const { setWidget } = useWidgetContext();
  const { setDrawerState } = useDrawerContext();
  const { styles } = useThemeContext();
  const [ohlcData, setOhlcData] = useState<OHLC[]>([]);
  const [hcData, setHcData] = useState<{ periodStartUnix: number, upper: number, lower: number }[]>([]);
  const [hcStates, setHcStates] = useState<{ periodStartUnix: number, trending: boolean, trend: boolean }[]>([]);
  const WETH = tokens['WETH'];

  const disabled = ohlcData.length === 0;

  const market = useMemo(() => computeHiroMarketSnapshot({
    token,
    ohlcData,
    lookback: HIRO_LOOKBACK,
  }), [token, ohlcData]);

  const handleHirosTake = () => {
    setWidget(null);
    setDrawerState({ isOpen: false, showRecommendations: false });
    const prompt = buildHiroTakePrompt({
      token,
      market,
      lookback: HIRO_LOOKBACK,
    });
    addPrompt(prompt);
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

        // Calculate Hiro Channel and map to chart format
        const { states } = calculateHiroChannel(fetchedOhlcData, HIRO_LOOKBACK);
        const hc = states.map(state => ({
          periodStartUnix: state.periodStartUnix,
          upper: state.top,
          lower: state.bottom
        }));

        // Extract market states for coloring
        const statesForChart = states.map(state => ({
          periodStartUnix: state.periodStartUnix,
          trending: state.trending,
          trend: state.trend
        }));

        setOhlcData(fetchedOhlcData);
        setHcData(hc);
        setHcStates(statesForChart);
      } catch (error) {
        console.error('Error fetching or processing OHLC data:', error);
      }
    };

    if (!didFetch.current) fetchOHLCData();
  }, [token, hours, WETH]);

  if (disabled) return <Spinner />;

  const cardClass = `rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${styles.background}`;
  const primaryActionClass = 'bg-emerald-500 text-white font-medium py-3 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-600';
  const secondaryActionClass = 'bg-blue-500 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors';
  const backButtonClass = `${styles.button} inline-flex items-center gap-2 text-sm font-medium px-3 py-2`;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${styles.text}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{token.symbol}</h2>
            <span className="text-2xl font-semibold">{market.price}</span>
          </div>
          <div className={`text-sm font-medium ${Number(market.change24h) >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {Number(market.change24h) >= 0 ? '+' : ''}{market.change24h}% (24h)
          </div>
        </div>
        <button
          className={backButtonClass}
          onClick={() => exit()}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to Portfolio</span>
        </button>
      </div>

      {/* Chart Section */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
        <CandlestickChart
          ohlcData={ohlcData}
          dcData={hcData}
          marketStates={hcStates}
          label={token.symbol}
        />
      </div>

      {/* Technical Indicators Section */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
        <MarketStats market={market} />
      </div>

      {/* Actions Section */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {account?.isConnected && (
            <>
              <button
                className={primaryActionClass}
                onClick={() => setWidget('Swap')}
              >
                Swap
              </button>
              <button
                className={primaryActionClass}
                onClick={() => setWidget('Earn')}
              >
                Earn
              </button>
              <button
                className={primaryActionClass}
                onClick={() => setWidget('Autonomous')}
              >
                Autonomous
              </button>
            </>
          )}
          <button
            className={secondaryActionClass}
            onClick={handleHirosTake}
          >
            Hiro&apos;s Take
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenData;

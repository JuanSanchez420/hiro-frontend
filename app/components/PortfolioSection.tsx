import React, { useCallback, useMemo, useState } from 'react';
import { AaveUserPosition, OHLC, PricesResponse, SimpleLiquidityPosition, Token } from '../types';
import formatNumber from '../utils/formatNumber';
import { Spinner } from './Spinner';
import { NULL_ADDRESS } from '../utils/constants';
import { useDrawerContext, useThemeContext, useWidgetContext } from '../context/GlobalContext';
import { usePromptsContext } from '../context/PromptsContext';
import tokens from '../utils/tokens.json';
import Tooltip from './Tooltip';
import { getRangeStyle } from '../utils/rangeHelpers';
import { buildHiroTakePrompt, computeHiroMarketSnapshot, HIRO_DEFAULT_HOURS, HIRO_DEFAULT_LOOKBACK } from '../utils/hiroTake';

const HOURS_FOR_HIRO_TAKE = HIRO_DEFAULT_HOURS;
const getTokenKey = (token: Token) => token.address.toLowerCase();

interface PortfolioSectionProps {
  balancesWithTokens: {
    token: Token;
    balance: string;
    usdPrice: number;
  }[];
  liquidityPositions?: SimpleLiquidityPosition[];
  aavePositions?: AaveUserPosition[];
  hiro: string | null;
  loading: boolean;
  setToken: (token: Token) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = React.memo(({
  balancesWithTokens,
  liquidityPositions = [],
  aavePositions = [],
  hiro,
  loading,
  setToken,
}) => {
  const { styles } = useThemeContext()
  const { setWidget } = useWidgetContext()
  const { setDrawerState } = useDrawerContext()
  const { addPrompt } = usePromptsContext();
  const [loadingToken, setLoadingToken] = useState<string | null>(null);
  const WETH = tokens['WETH'];
  const hasLiquidityPositions = liquidityPositions && liquidityPositions.length > 0;
  const hasAavePositions = aavePositions && aavePositions.length > 0;

  const aavePositionsWithTokens = useMemo(() => {
    if (!hasAavePositions) return [];

    return aavePositions.map((position) => ({
      ...position,
      tokenMetadata: tokens[position.token as keyof typeof tokens],
    }));
  }, [aavePositions, hasAavePositions]);

  const handleHiroTake = useCallback(async (token: Token) => {
    const tokenKey = getTokenKey(token);
    setLoadingToken(tokenKey);

    try {
      const tokenAddress = token.isNative ? WETH.address : token.address;
      const response = await fetch(
        `/api/prices?tokens=${encodeURIComponent(tokenAddress)}&hours=${HOURS_FOR_HIRO_TAKE}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData: PricesResponse = await response.json();
      const fetchedOhlcData: OHLC[] = responseData[tokenAddress.toLowerCase()];

      if (!fetchedOhlcData || fetchedOhlcData.length === 0) {
        throw new Error('No OHLC data returned for token.');
      }

      const market = computeHiroMarketSnapshot({
        token,
        ohlcData: fetchedOhlcData,
        lookback: HIRO_DEFAULT_LOOKBACK,
      });

      const prompt = buildHiroTakePrompt({
        token,
        market,
        lookback: HIRO_DEFAULT_LOOKBACK,
      });

      setWidget(null);
      setDrawerState({ isOpen: false, showRecommendations: false });
      addPrompt(prompt);
    } catch (error) {
      console.error("Error preparing Hiro's Take:", error);
    } finally {
      setLoadingToken(null);
    }
  }, [WETH.address, addPrompt, setDrawerState, setWidget]);

  const formatUsdValue = useCallback((value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return '-';
    }
    return `$${formatNumber(value)}`;
  }, []);

  const formatAprValue = useCallback((apr?: number) => {
    if (apr === undefined || apr === null || Number.isNaN(apr)) {
      return '-';
    }
    return `${formatNumber(apr * 100)}%`;
  }, []);

  const getFeeTier = useCallback((fee: number): string => {
    if (fee === undefined || fee === null || Number.isNaN(fee)) {
      return 'unknown';
    }
    const feeMap: { [key: number]: string } = {
      100: '0.01%',
      500: '0.05%',
      3000: '0.30%',
      10000: '1.00%',
    };
    return feeMap[fee] || `${(fee / 10000)}%`;
  }, []);

  const handleRemovePosition = useCallback((position: SimpleLiquidityPosition) => {
    const feeTier = getFeeTier(position.fee);
    if (confirm(`Are you sure you want to remove liquidity position ${position.token0}/${position.token1} (${feeTier})?`)) {
      setDrawerState({ isOpen: false, showRecommendations: false });
      addPrompt(`Remove liquidity for ${position.token0}/${position.token1} at ${feeTier}`);
    }
  }, [addPrompt, getFeeTier, setDrawerState]);

  if (loading) return <Spinner />;
  if (!hiro || hiro === NULL_ADDRESS) return null;

  return (
    <div className="px-1 mb-8">
      <div className="flex items-center">
        <div className="flex-auto">
          <h1 className="text-base font-semibold">Portfolio</h1>
        </div>
        <div className="mt-4 ml-16 mt-0 flex-none hidden">
          <button
            type="button"
            className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Buy Crypto
          </button>
        </div>
      </div>
      <div className="mt-1 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">
                    Token
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Balance
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    USD
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Hiro&apos;s Take
                  </th>
                </tr>
              </thead>
              <tbody className={styles.background}>
                {balancesWithTokens.map((item) => (
                  <tr
                    key={item.token.symbol}
                    className={`${styles.highlightRow} hover:cursor-pointer`}
                    onClick={() => setToken(item.token)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                      <div className='flex items-center'>
                        <img
                          src={item.token.logoURI}
                          height={30}
                          width={30}
                          alt={item.token.symbol}
                          className="rounded-full mr-1"
                        />
                        <span>{item.token.symbol}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{formatNumber(item.balance)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">${formatNumber(Number(item.balance) * Number(item.usdPrice))}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <button
                        className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleHiroTake(item.token);
                        }}
                        disabled={loadingToken === getTokenKey(item.token)}
                      >
                        {loadingToken === getTokenKey(item.token) ? 'Loading...' : "Hiro's Take"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {hasLiquidityPositions && (
        <div className="mt-8">
          <div className="flex items-center">
            <div className="flex-auto">
              <h2 className="text-base font-semibold">Liquidity Positions</h2>
            </div>
          </div>
          <div className="mt-1 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="px-3 py-3.5 pl-4 text-left text-sm font-semibold">Pair</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Range</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Value (USD)</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">APR</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Profit</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`${styles.background} ${styles.text}`}>
                    {liquidityPositions.map((position) => {
                      const rangeStyle = getRangeStyle(position.rangeWidthPercent);
                      return (
                        <tr key={`position-${position.index}`} className={`${styles.highlightRow}`}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">
                            {position.token0}/{position.token1} - {getFeeTier(position.fee)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <Tooltip content={rangeStyle.tooltip} position="top">
                              <span className={`font-semibold ${rangeStyle.color}`}>
                                {Math.floor(position.rangeWidthPercent)}% - {rangeStyle.label}
                              </span>
                            </Tooltip>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{formatUsdValue(position.positionValueUSD)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{formatAprValue(position.apr)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{formatUsdValue(position.feesUSD)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">
                            <button className={styles.buttonSm} onClick={() => handleRemovePosition(position)}>Remove</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasAavePositions && (
        <div className="mt-8">
          <div className="flex items-center">
            <div className="flex-auto">
              <h2 className="text-base font-semibold">Aave Positions</h2>
            </div>
          </div>
          <div className="mt-1 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">Token</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Supplied</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Supply APY</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Borrowed</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Borrow APY</th>
                    </tr>
                  </thead>
                  <tbody className={styles.background}>
                    {aavePositionsWithTokens.map((position) => (
                      <tr key={position.token} className={styles.highlightRow}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                          <div className='flex items-center'>
                            {position.tokenMetadata?.logoURI && (
                              <img
                                src={position.tokenMetadata.logoURI}
                                height={30}
                                width={30}
                                alt={position.token}
                                className="rounded-full mr-1"
                              />
                            )}
                            <span>{position.token}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {Number(position.balance) > 0 ? formatNumber(position.balance) : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {Number(position.depositAPY) > 0 ? `${formatNumber(position.depositAPY)}%` : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {Number(position.variableDebt) > 0 ? formatNumber(position.variableDebt) : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold text-red-600">
                          {Number(position.variableBorrowAPY) > 0 ? `${formatNumber(position.variableBorrowAPY)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
});

PortfolioSection.displayName = 'PortfolioSection';

export default PortfolioSection;

'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { usePromptsContext } from '../context/PromptsContext';
import formatNumber from '../utils/formatNumber';
import { Spinner } from './Spinner';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import tokens from '../utils/tokens.json';
import Tooltip from './Tooltip';
import { getRangeStyle } from '../utils/rangeHelpers';
import { buildHiroTakePrompt, computeHiroMarketSnapshot, HIRO_DEFAULT_HOURS, HIRO_DEFAULT_LOOKBACK } from '../utils/hiroTake';
import { OHLC, PricesResponse } from '../types';

const HIRO_LOOKBACK = HIRO_DEFAULT_LOOKBACK;
const HOURS_FOR_HIRO_TAKE = HIRO_DEFAULT_HOURS;

// Helper function to parse numbers that may contain commas or percentage signs
const parseNumericValue = (value: string | number): number => {
    if (typeof value === 'number') return value;
    // Remove commas and percentage signs, then parse
    return Number(value.replace(/,/g, '').replace(/%/g, ''));
};

// Helper function to get token info by symbol
const getTokenBySymbol = (symbol: string) => {
    return tokens[symbol as keyof typeof tokens];
};

type PoolOpportunity = {
    poolAddress: string;
    token0Symbol: string;
    token1Symbol: string;
    feeTier: number;
    volumeUSD: string;
    feesUSD: string;
    tvlUSD: string;
    feeToTVLRatio: number;
    annualizedYield: number;
};

type AaveOpportunity = {
    token: string;
    depositAPY: string;
    variableBorrowAPY: string;
    totalSupplied: string;
    availableLiquidity: string;
};

type TokenPosition = {
    symbol: string;
    balance: string;
    usdValue: string;
};

type LiquidityPosition = {
    index: string;
    token0: string;
    token1: string;
    fee: number;
    tickLower: number;
    tickUpper: number;
    rangeWidthTicks: number;
    rangeWidthPercent: number;
    liquidity: string;
    tokensOwed0: string;
    tokensOwed1: string;
    apr?: number;
    feesUSD?: number;
    positionValueUSD?: number;
    daysElapsed?: number;
};

type AavePosition = {
    token: string;
    supplied?: {
        balance: string;
        apy: string;
    };
    borrowed?: {
        balance: string;
        apy: string;
    };
};

type RecommendationsResult = {
    portfolio: {
        tokens: TokenPosition[];
        liquidityPositions: LiquidityPosition[];
        aavePositions: AavePosition[];
    };
    opportunities: {
        liquidityPools: PoolOpportunity[];
        aaveLending: AaveOpportunity[];
    };
    error?: string;
};

const Recommendations: React.FC = React.memo(() => {
    const { styles, setDrawerLeftOpen, setShowRecommendations, setWidget, setWidgetData } = useGlobalContext();
    const { addPrompt } = usePromptsContext();
    const [data, setData] = useState<RecommendationsResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingSymbol, setLoadingSymbol] = useState<string | null>(null);

    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/recommendations');
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const closeRecommendations = useCallback(() => {
        setDrawerLeftOpen(false);
        setShowRecommendations(false);
    }, [setDrawerLeftOpen, setShowRecommendations]);

    const handleAddPrompt = useCallback((prompt: string) => {
        addPrompt(prompt);
        closeRecommendations();
    }, [addPrompt, closeRecommendations]);

    const fetchTokenOhlc = useCallback(async (symbol: string): Promise<OHLC[]> => {
        const tokenInfo = getTokenBySymbol(symbol);
        if (!tokenInfo) {
            throw new Error(`Token metadata not found for ${symbol}`);
        }
        const address = tokenInfo.isNative ? tokens['WETH'].address : tokenInfo.address;
        const response = await fetch(`/api/prices?tokens=${encodeURIComponent(address)}&hours=${HOURS_FOR_HIRO_TAKE}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch OHLC data for ${symbol}`);
        }
        const responseData: PricesResponse = await response.json();
        const key = address.toLowerCase();
        const ohlcData = responseData[key];
        if (!ohlcData || ohlcData.length === 0) {
            throw new Error(`No OHLC data returned for ${symbol}`);
        }
        return ohlcData;
    }, []);

    const handleHiroTake = useCallback(async (symbol: string) => {
        try {
            setLoadingSymbol(symbol);
            const tokenInfo = getTokenBySymbol(symbol);
            if (!tokenInfo) {
                throw new Error(`Token metadata not found for ${symbol}`);
            }
            const ohlcData = await fetchTokenOhlc(symbol);
            const market = computeHiroMarketSnapshot({
                token: tokenInfo,
                ohlcData,
                lookback: HIRO_LOOKBACK,
            });
            const prompt = buildHiroTakePrompt({
                token: tokenInfo,
                market,
                lookback: HIRO_LOOKBACK,
            });
            setWidget(null);
            addPrompt(prompt);
            closeRecommendations();
        } catch (err) {
            console.error("Error fetching Hiro's Take:", err);
        } finally {
            setLoadingSymbol(null);
        }
    }, [addPrompt, closeRecommendations, fetchTokenOhlc, setWidget]);

    const handleOpenLiquidityWidget = useCallback((pool: PoolOpportunity) => {
        setWidgetData({
            token0: pool.token0Symbol,
            token1: pool.token1Symbol,
            feeTier: `${(parseNumericValue(pool.feeTier) / 10000)}%`,
        });
        setWidget("Earn");
        closeRecommendations();
    }, [setWidgetData, setWidget, closeRecommendations]);

    const formatUsdValue = (value?: number | string) => {
        if (value === undefined) {
            return '-';
        }
        const numeric = Number(value);
        if (Number.isNaN(numeric)) {
            return '-';
        }
        return `$${formatNumber(numeric)}`;
    };

    const formatAprValue = (apr?: number | string) => {
        if (apr === undefined) {
            return '-';
        }
        const numeric = Number(apr);
        if (Number.isNaN(numeric)) {
            return '-';
        }
        return `${formatNumber(numeric * 100)}%`;
    };

    const getFeeTier = (fee: number): string => {
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
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!data) return null;

    return (
        <div className="space-y-8 px-1">
            {/* Current Portfolio */}
            <div>
                <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>

                {/* Token Positions */}
                {data.portfolio.tokens.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">Tokens</h3>
                        <div className="overflow-x-auto">
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
                                            USD Value
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Hiro&apos;s Take
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.portfolio.tokens.map((token) => {
                                        const tokenInfo = getTokenBySymbol(token.symbol);
                                        return (
                                            <tr key={token.symbol} className={styles.highlightRow}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                    <div className='flex items-center'>
                                                        {tokenInfo?.logoURI && (
                                                            <img
                                                                src={tokenInfo.logoURI}
                                                                height={30}
                                                                width={30}
                                                                alt={token.symbol}
                                                                className="rounded-full mr-1"
                                                            />
                                                        )}
                                                        <span>{token.symbol}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatNumber(token.balance)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ${formatNumber(token.usdValue)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <button
                                                        className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                                                        onClick={() => handleHiroTake(token.symbol)}
                                                        disabled={loadingSymbol === token.symbol}
                                                    >
                                                        {loadingSymbol === token.symbol ? 'Loading...' : "Hiro's Take"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Liquidity Positions */}
                {data.portfolio.liquidityPositions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">Liquidity Positions</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">Pair</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Range</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Value (USD)</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">APR</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.portfolio.liquidityPositions.map((position) => {
                                        const token0Info = getTokenBySymbol(position.token0);
                                        const token1Info = getTokenBySymbol(position.token1);
                                        const rangeStyle = getRangeStyle(position.rangeWidthPercent);
                                        return (
                                            <tr key={position.index} className={styles.highlightRow}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                    <div className='flex items-center'>
                                                        {token0Info?.logoURI && (
                                                            <img
                                                                src={token0Info.logoURI}
                                                                height={24}
                                                                width={24}
                                                                alt={position.token0}
                                                                className="rounded-full mr-1"
                                                            />
                                                        )}
                                                        {token1Info?.logoURI && (
                                                            <img
                                                                src={token1Info.logoURI}
                                                                height={24}
                                                                width={24}
                                                                alt={position.token1}
                                                                className="rounded-full mr-1"
                                                            />
                                                        )}
                                                        <span>{position.token0}/{position.token1} - {getFeeTier(position.fee)}</span>
                                                    </div>
                                                </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <Tooltip content={rangeStyle.tooltip} position="top">
                                                    <span className={`font-semibold ${rangeStyle.color}`}>
                                                        {Math.floor(position.rangeWidthPercent)}% - {rangeStyle.label}
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatUsdValue(position.positionValueUSD)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatAprValue(position.apr)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatUsdValue(position.feesUSD)}
                                            </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Aave Positions */}
                {data.portfolio.aavePositions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">Aave Positions</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">
                                            Token
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Supplied
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Supply APY
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Borrowed
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Borrow APY
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.portfolio.aavePositions.map((position) => {
                                        const tokenInfo = getTokenBySymbol(position.token);
                                        return (
                                            <tr key={position.token} className={styles.highlightRow}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                    <div className='flex items-center'>
                                                        {tokenInfo?.logoURI && (
                                                            <img
                                                                src={tokenInfo.logoURI}
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
                                                {position.supplied ? formatNumber(position.supplied.balance) : '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {position.supplied ? `${formatNumber(position.supplied.apy)}%` : '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {position.borrowed ? formatNumber(position.borrowed.balance) : '-'}
                                            </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold text-red-600">
                                                    {position.borrowed ? `${formatNumber(position.borrowed.apy)}%` : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Opportunities */}
            <div>
                <h2 className="text-xl font-bold mb-4">Recommended Opportunities</h2>

                {/* Liquidity Pool Opportunities */}
                {data.opportunities.liquidityPools.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">Liquidity Pools</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">
                                            Pool
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold">
                                            Action
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Est. APY
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            TVL
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            24h Volume
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            24h Fees
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.opportunities.liquidityPools.map((pool) => {
                                        const token0Info = getTokenBySymbol(pool.token0Symbol);
                                        const token1Info = getTokenBySymbol(pool.token1Symbol);
                                        return (
                                            <tr key={pool.poolAddress} className={styles.highlightRow}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                    <div className='flex items-center'>
                                                        {token0Info?.logoURI && (
                                                            <img
                                                                src={token0Info.logoURI}
                                                                height={24}
                                                                width={24}
                                                                alt={pool.token0Symbol}
                                                                className="rounded-full mr-1"
                                                            />
                                                        )}
                                                        {token1Info?.logoURI && (
                                                            <img
                                                                src={token1Info.logoURI}
                                                                height={24}
                                                                width={24}
                                                                alt={pool.token1Symbol}
                                                                className="rounded-full mr-1"
                                                            />
                                                        )}
                                                        <span>{pool.token0Symbol}/{pool.token1Symbol} - {(parseNumericValue(pool.feeTier) / 10000)}%</span>
                                                    </div>
                                                </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                                <button
                                                    onClick={() => handleOpenLiquidityWidget(pool)}
                                                    className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
                                                    title="Add liquidity"
                                                >
                                                    <PlusCircleIcon className="size-5" />
                                                </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold text-green-600">
                                                {formatNumber(pool.annualizedYield)}%
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ${formatNumber(parseNumericValue(pool.tvlUSD))}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ${formatNumber(parseNumericValue(pool.volumeUSD))}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ${formatNumber(parseNumericValue(pool.feesUSD))}
                                            </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Aave Lending Opportunities */}
                {data.opportunities.aaveLending.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">Aave Lending</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">
                                            Token
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold">
                                            Action
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Deposit APY
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Borrow APY
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Total Supplied
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Available
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.opportunities.aaveLending.map((opportunity) => {
                                        const tokenInfo = getTokenBySymbol(opportunity.token);
                                        return (
                                            <tr key={opportunity.token} className={styles.highlightRow}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                    <div className='flex items-center'>
                                                        {tokenInfo?.logoURI && (
                                                            <img
                                                                src={tokenInfo.logoURI}
                                                                height={30}
                                                                width={30}
                                                                alt={opportunity.token}
                                                                className="rounded-full mr-1"
                                                            />
                                                        )}
                                                        <span>{opportunity.token}</span>
                                                    </div>
                                                </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                                <button
                                                    onClick={() => handleAddPrompt(`Supply ${opportunity.token} to Aave`)}
                                                    className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
                                                    title="Add supply prompt"
                                                >
                                                    <PlusCircleIcon className="size-5" />
                                                </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold text-green-600">
                                                {formatNumber(parseNumericValue(opportunity.depositAPY))}%
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold text-red-600">
                                                {formatNumber(parseNumericValue(opportunity.variableBorrowAPY))}%
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ${formatNumber(parseNumericValue(opportunity.totalSupplied))}
                                            </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ${formatNumber(parseNumericValue(opportunity.availableLiquidity))}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

Recommendations.displayName = 'Recommendations';

export default Recommendations;

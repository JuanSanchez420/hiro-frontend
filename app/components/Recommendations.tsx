'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { usePromptsContext } from '../context/PromptsContext';
import formatNumber from '../utils/formatNumber';
import { Spinner } from './Spinner';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

// Helper function to parse numbers that may contain commas or percentage signs
const parseNumericValue = (value: string | number): number => {
    if (typeof value === 'number') return value;
    // Remove commas and percentage signs, then parse
    return Number(value.replace(/,/g, '').replace(/%/g, ''));
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
    index: number;
    token0Symbol: string;
    token1Symbol: string;
    liquidity: string;
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
    const { styles, setDrawerLeftOpen, setShowRecommendations } = useGlobalContext();
    const { addPrompt } = usePromptsContext();
    const [data, setData] = useState<RecommendationsResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleAddPrompt = useCallback((prompt: string) => {
        addPrompt(prompt);
        setDrawerLeftOpen(false);
        setShowRecommendations(false);
    }, [addPrompt, setDrawerLeftOpen, setShowRecommendations]);

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
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.portfolio.tokens.map((token) => (
                                        <tr key={token.symbol} className={styles.highlightRow}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                {token.symbol}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatNumber(token.balance)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ${formatNumber(token.usdValue)}
                                            </td>
                                        </tr>
                                    ))}
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
                                        <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold">
                                            Position
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Pair
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Liquidity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.portfolio.liquidityPositions.map((position) => (
                                        <tr key={position.index} className={styles.highlightRow}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                #{position.index}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {position.token0Symbol}/{position.token1Symbol}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatNumber(position.liquidity)}
                                            </td>
                                        </tr>
                                    ))}
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
                                    {data.portfolio.aavePositions.map((position) => (
                                        <tr key={position.token} className={styles.highlightRow}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                {position.token}
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
                                    ))}
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
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            Fee Tier
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.background}>
                                    {data.opportunities.liquidityPools.map((pool) => (
                                        <tr key={pool.poolAddress} className={styles.highlightRow}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                {pool.token0Symbol}/{pool.token1Symbol}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                                <button
                                                    onClick={() => handleAddPrompt(`Deposit into ${pool.token0Symbol}/${pool.token1Symbol} pool with ${(parseNumericValue(pool.feeTier) / 10000)}% fee tier`)}
                                                    className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
                                                    title="Add deposit prompt"
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
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {(parseNumericValue(pool.feeTier) / 10000)}%
                                            </td>
                                        </tr>
                                    ))}
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
                                    {data.opportunities.aaveLending.map((opportunity) => (
                                        <tr key={opportunity.token} className={styles.highlightRow}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                                                {opportunity.token}
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
                                    ))}
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

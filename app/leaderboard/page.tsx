// page.tsx
'use client'
import { useState } from 'react';
import { Portfolio } from '../types';
import formatNumber from '../utils/formatNumber';
import { formatEther } from 'viem';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface LeaderboardPortfolio extends Portfolio {
  totalUSDValue: string; // Added USD value for sorting
}

export default function LeaderboardPage() {
  const [portfolios, ] = useState<LeaderboardPortfolio[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // Sort portfolios by USD value, highest first
  const sortedPortfolios = [...portfolios].sort((a, b) => 
    parseFloat(b.totalUSDValue) - parseFloat(a.totalUSDValue)
  );

  const truncateAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatUsdValue = (value?: number) => {
    if (value === undefined || Number.isNaN(value)) {
      return '-';
    }
    return `$${formatNumber(value)}`;
  };

  const formatAprValue = (apr?: number) => {
    if (apr === undefined || Number.isNaN(apr)) {
      return '-';
    }
    return `${formatNumber(apr * 100)}%`;
  };

  const formatUnclaimedFees = (position: Portfolio['positions'][number]) => {
    const owed0 = Number(position.tokensOwed0);
    const owed1 = Number(position.tokensOwed1);

    const parts: string[] = [];

    if (!Number.isNaN(owed0) && owed0 > 0) {
      parts.push(`${formatNumber(owed0)} ${position.token0}`);
    }

    if (!Number.isNaN(owed1) && owed1 > 0) {
      parts.push(`${formatNumber(owed1)} ${position.token1}`);
    }

    return parts.length > 0 ? parts.join(' · ') : '-';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Trading Competition Leaderboard</h1>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 bg-gray-700 p-4 font-medium text-gray-200">
          <div>Rank</div>
          <div>Trader</div>
          <div className="text-right">Portfolio Value</div>
          <div className="text-right">HIRO Balance</div>
        </div>
        
        {/* Leaderboard entries */}
        {sortedPortfolios.map((portfolio, index) => (
          <div key={portfolio.address} className="border-t border-gray-700">
            {/* Accordion header */}
            <div 
              className="grid grid-cols-4 p-4 cursor-pointer hover:bg-gray-750 items-center"
              onClick={() => toggleExpand(index)}
            >
              <div className="font-bold text-xl text-emerald-400">{index + 1}</div>
              <div className="font-mono">{truncateAddress(portfolio.address)}</div>
              <div className="text-right font-medium text-green-400">
                ${parseFloat(portfolio.totalUSDValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
              <div className="flex justify-end items-center">
                <span className="text-right mr-4">{parseFloat(formatEther(BigInt(portfolio.hiroBalance))).toFixed(2)}</span>
                {expandedIndex === index ? 
                  <ChevronUpIcon className="w-5 h-5" /> : 
                  <ChevronDownIcon className="w-5 h-5" />
                }
              </div>
            </div>
            
            {/* Accordion content */}
            {expandedIndex === index && (
              <div className="bg-gray-850 p-4 border-t border-gray-700">
                {/* Tokens section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-emerald-300">Tokens</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-400 mb-1">
                    <div>Symbol</div>
                    <div className="text-right">Balance</div>
                    <div className="text-right">USD Value</div>
                  </div>
                  {portfolio.tokens.map((token) => (
                    <div key={token.symbol} className="grid grid-cols-3 gap-2 text-sm">
                      <div>{token.symbol}</div>
                      <div className="text-right">{parseFloat(token.balance).toFixed(4)}</div>
                      <div className="text-right">${(parseFloat(token.balance) * token.usdPrice).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                {/* Positions section */}
                {portfolio.positions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-emerald-300">Liquidity Positions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400">
                            <th className="text-left pb-2">Pair</th>
                            <th className="text-right pb-2">Value (USD)</th>
                            <th className="text-right pb-2">APR</th>
                            <th className="text-right pb-2">Fees (USD)</th>
                            <th className="text-left pb-2">Unclaimed Fees</th>
                            <th className="text-right pb-2">Days</th>
                            <th className="text-right pb-2">Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.positions.map((position) => (
                            <tr key={position.index}>
                              <td className="py-1">{position.token0}/{position.token1}</td>
                              <td className="text-right">{formatUsdValue(position.positionValueUSD)}</td>
                              <td className="text-right">{formatAprValue(position.apr)}</td>
                              <td className="text-right">{formatUsdValue(position.feesUSD)}</td>
                              <td className="text-left">{formatUnclaimedFees(position)}</td>
                              <td className="text-right">{position.daysElapsed !== undefined ? formatNumber(position.daysElapsed) : '-'}</td>
                              <td className="text-right">
                                <span className="text-xs">
                                  {position.tickLower} → {position.tickUpper}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

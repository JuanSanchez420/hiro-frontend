import React from 'react';
import formatNumber from '../utils/formatNumber';
import { useGlobalContext } from '../context/GlobalContext';
import { usePromptsContext } from '../context/PromptsContext';
import { SimpleLiquidityPosition } from '../types';
import Tooltip from './Tooltip';
import { getRangeStyle } from '../utils/rangeHelpers';

interface LiquidityPositionsSectionProps {
  positions: SimpleLiquidityPosition[];
}

const LiquidityPositionsSection: React.FC<LiquidityPositionsSectionProps> = ({
  positions,
}) => {
  const { styles, setDrawerLeftOpen } = useGlobalContext()
  const { addPrompt } = usePromptsContext()

  if (!positions || positions.length === 0) return null;

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

  const getFeeTierFromTickSpacing = (tickSpacing: number): string => {
    const feeMap: { [key: number]: string } = {
      1: '0.01%',
      10: '0.05%',
      60: '0.30%',
      200: '1.00%',
    };
    return feeMap[tickSpacing] || `${(tickSpacing / 10000)}%`;
  };

  const handleRemove = (position: SimpleLiquidityPosition) => {
    if (confirm(`Are you sure you want to remove liquidity position ${position.token0}/${position.token1}?`)) {
      setDrawerLeftOpen(false)
      addPrompt(`Remove liquidity with position index ${position.index}`)
    }
  }

  return (
    <div className="px-1 mb-8">
      <div className="flex items-center">
        <div className="flex-auto">
          <h1 className="text-base font-semibold">Liquidity Positions</h1>
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
                  <th scope="col" className="px-3 py-3.5 pl-4 text-left text-sm font-semibold">Pair</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Range</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Value (USD)</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">APR</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Profit</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className={`${styles.background} ${styles.text}`}>
                {positions.map((position) => {
                  const rangeStyle = getRangeStyle(position.rangeWidthPercent);
                  return (
                    <tr key={`position-${position.index}`} className={`${styles.highlightRow}`}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{position.token0}/{position.token1} - {getFeeTierFromTickSpacing(position.tickSpacing)}</td>
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate"><button className={styles.buttonSm} onClick={() => handleRemove(position)}>Remove</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};

export default LiquidityPositionsSection;

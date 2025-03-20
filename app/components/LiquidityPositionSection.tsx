import React from 'react';
import { formatEther } from 'viem';
import formatNumber from '../utils/formatNumber';
import { useGlobalContext } from '../context/GlobalContext';

interface Position {
  index: number;
  token0: string;
  token1: string;
  liquidity: bigint;
}

interface LiquidityPositionsSectionProps {
  positions: Position[];
}

const LiquidityPositionsSection: React.FC<LiquidityPositionsSectionProps> = ({
  positions,
}) => {
  const { setDrawerRightOpen, setWidget, styles } = useGlobalContext()

  if (!positions || positions.length === 0) return null;

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
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold">
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
              <tbody className={`${styles.background} ${styles.text}`}>
                {positions.map((position) => (
                  <tr key={`position-${position.index}`} className={`${styles.highlightRow} hover:cursor-pointer`} onClick={(e) => {
                    e.preventDefault()
                    setWidget('Earn')
                    setDrawerRightOpen(false)
                  }} >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                      {position.index}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{position.token0}/{position.token1}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{`${formatNumber(formatEther(position.liquidity))}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col mt-3">
      <div className='border-b mb-3'>Liquidity Positions</div>
      <div className="flex-1">
        <div>
          <a className="grid grid-cols-4 gap-2 p-2 text-gray-700 group rounded-md text-sm/6 font-semibold">
            <div>POSITION</div>
            <div>PAIR</div>
            <div>LIQUIDITY</div>
          </a>
        </div>
        {positions.map((position) => {
          return (
            <div key={position.index}>
              <a
                onClick={(e) => {
                  e.preventDefault()
                  setWidget('Earn')
                  setDrawerRightOpen(false)
                }}
                className="grid grid-cols-4 gap-2 p-2 text-gray-700 hover:bg-gray-50 group rounded-md text-sm/6 font-semibold cursor-pointer"
              >
                <div>{position.index}</div>
                <div>{position.token0}/{position.token1}</div>
                <div className='truncate'>{`${formatNumber(formatEther(position.liquidity))}`}</div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiquidityPositionsSection;
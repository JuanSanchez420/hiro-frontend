import React, { useMemo } from 'react';
import { AaveUserPosition } from '../types';
import formatNumber from '../utils/formatNumber';
import { useGlobalContext } from '../context/GlobalContext';
import tokens from '../utils/tokens.json'

interface AaveBorrowSectionProps {
  aave: AaveUserPosition[];
}

const AaveBorrowSection: React.FC<AaveBorrowSectionProps> = ({
  aave,
}) => {
  const { styles, setWidget, setDrawerLeftOpen } = useGlobalContext()
  // const token = tokens[rain?.toUpperCase() as keyof typeof tokens];

  const handleRowClick = () => {
    setWidget('Borrow')
    setDrawerLeftOpen(false)
  }

  const aavePositionsWithTokens = useMemo(() => {
    return aave.map((item) => ({
      ...item,
      token: tokens[item.token as keyof typeof tokens],
    })).filter((item) => item.usageAsCollateral)
  }, [aave])

  return (
    <div className="px-1 mb-8">
      <div className="flex items-center">
        <div className="flex-auto">
          <h1 className="text-base font-semibold">Aave Borrowing</h1>
        </div>
      </div>
      <div className="mt-1 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold">
                    Token
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
                {aavePositionsWithTokens.map((item) => (
                  <tr key={item.token.symbol} className={`${styles.highlightRow} hover:cursor-pointer`} onClick={handleRowClick}>
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{formatNumber(item.variableDebt)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate">{`${item.variableBorrowAPY}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};

export default AaveBorrowSection;
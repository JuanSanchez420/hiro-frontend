import React from 'react';
import { Token } from '../types';
import formatNumber from '../utils/formatNumber';
import { Spinner } from './Spinner';
import { NULL_ADDRESS } from '../utils/constants';
import { useGlobalContext } from '../context/GlobalContext';

interface PortfolioSectionProps {
  balancesWithTokens: {
    token: Token;
    balance: string;
    usdPrice: number;
  }[];
  hiro: string | null;
  loading: boolean;
  setToken: (token: Token) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = React.memo(({
  balancesWithTokens,
  hiro,
  loading,
  setToken,
}) => {
  const { styles } = useGlobalContext()
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
                </tr>
              </thead>
              <tbody className={styles.background}>
                {balancesWithTokens.map((item) => (
                  <tr key={item.token.symbol} className={`${styles.highlightRow} hover:cursor-pointer`} onClick={() => setToken(item.token)}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
});

PortfolioSection.displayName = 'PortfolioSection';

export default PortfolioSection;
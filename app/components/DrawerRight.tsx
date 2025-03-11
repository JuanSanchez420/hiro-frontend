'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import tokensData from "../utils/tokens.json";
import { Token, TokensData } from "../types";
import { useMemo, useState } from 'react';
import formatNumber from '../utils/formatNumber';
import TokenData from './TokenData';
import { Spinner } from './Spinner';
import useMarketData from '../hooks/useMarketData';
import { useGlobalContext } from '../context/GlobalContext';
import useHiro from '../hooks/useHiro';
import { NULL_ADDRESS } from '../utils/constants';
import { usePortfolioContext } from '../context/PortfolioContext';

export default function DrawerRight() {
  const { drawerRightOpen, setDrawerRightOpen } = useGlobalContext();
  const [token, setToken] = useState<Token | null>(null);

  const { market } = useMarketData();
  const { hiro } = useHiro()
  const { portfolio, loading } = usePortfolioContext();
  const tokens: TokensData = tokensData;

  const balancesWithTokens = useMemo(() => {
    if (!portfolio || !portfolio.tokens) return [];
    return portfolio.tokens.map((t) => {
      return {
        token: tokens[t.symbol],
        balance: t.balance,
        usdPrice: t.usdPrice,
      };
    });
  }, [portfolio, tokens]);

  return (
    <Dialog open={drawerRightOpen} onClose={() => {
      setDrawerRightOpen(false)
      setToken(null)
    }} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-12 flex pl-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-mr-10 sm:pl-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerRightOpen(false)
                      setToken(null)
                    }}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold text-gray-900">{/* title area */}</DialogTitle>
                </div>
                <div className="relative flex-1 px-4 sm:px-6 h-full">
                  {/* Portfolio */}
                  {!token && loading && <Spinner />}
                  {!token && hiro && hiro !== NULL_ADDRESS && <div className="flex flex-col">
                    <div className="flex-1">
                      <div className='border-b mb-3 truncate'>Portfolio (<span className='text-sm gray-500'>{hiro}</span>)</div>
                      <div>
                        <a className="grid grid-cols-4 gap-2 p-2 text-gray-700 group rounded-md text-sm/6 font-semibold">
                          <div>ICON</div>
                          <div>SYMBOL</div>
                          <div>BALANCE</div>
                          <div>USD</div>
                        </a>
                      </div>
                      {balancesWithTokens.map((item) => {
                        return (
                          <div key={item.token.symbol}>
                            <a
                              className="grid grid-cols-4 gap-2 p-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 group rounded-md text-sm/6 font-semibold hover:cursor-pointer"
                              onClick={() => setToken(item.token)}
                              href="#">
                              <div><img src={item.token.logoURI} height={30} width={30} alt={item.token.symbol} className="rounded-full" /></div>
                              <div>{item.token.symbol}</div>
                              <div>{formatNumber(item.balance)}</div>
                              <div>${formatNumber(Number(item.balance) * Number(item.usdPrice))}</div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>}
                  {!token && market.length > 0 &&
                    <div className="flex flex-col mt-3">
                      <div className='border-b mb-3'>Market Data</div>
                      <div className="flex-1">
                        <div>
                          <a className="grid grid-cols-4 gap-2 p-2 text-gray-700 group rounded-md text-sm/6 font-semibold">
                            <div>ICON</div>
                            <div>SYMBOL</div>
                            <div>USD</div>
                          </a>
                        </div>
                        {market.map((item) => {
                          return (
                            <div key={item.token.symbol}>
                              <a
                                className="grid grid-cols-4 gap-2 p-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 group rounded-md text-sm/6 font-semibold hover:cursor-pointer"
                                onClick={() => setToken(item.token)}
                                href="#">
                                <div><img src={item.token.logoURI} height={30} width={30} alt={item.token.symbol} className="rounded-full" /></div>
                                <div>{item.token.symbol}</div>
                                <div>${formatNumber(Number(item.usdPrice))}</div>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  }
                  {/* Chart */}
                  {token && <TokenData token={token} hours={200} exit={() => setToken(null)} />}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

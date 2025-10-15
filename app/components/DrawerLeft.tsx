'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useGlobalContext } from '../context/GlobalContext';
import History from "./History"
import ThemeToggle from './ThemeToggle';
import tokensData from "../utils/tokens.json";
import { Token, TokensData } from "../types";
import { useCallback, useMemo, useState } from 'react';
import TokenData from './TokenData';
import useMarketData from '../hooks/useMarketData';
import useHiro from '../hooks/useHiro';
import { usePortfolioContext } from '../context/PortfolioContext';
import PortfolioSection from './PortfolioSection';
import MarketDataSection from './MarketDataSection';
import LiquidityPositionsSection from './LiquidityPositionSection';
import AaveLendingSection from './AaveLendingSection';
import AaveBorrowSection from './AaveBorrowSection';
import Recommendations from './Recommendations';
import { useMessagesContext } from '../context/MessagesContext';
import { usePromptsContext } from '../context/PromptsContext';

export default function Drawer() {
  const { drawerLeftOpen, setDrawerLeftOpen, showRecommendations, setShowRecommendations, styles } = useGlobalContext();
  const [token, setTokenState] = useState<Token | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const { market } = useMarketData();
  const { hiro } = useHiro();
  const { portfolio, loading } = usePortfolioContext();
  const { resetMessages } = useMessagesContext();
  const { resetPrompts } = usePromptsContext();
  const tokens: TokensData = tokensData;

  const setToken = useCallback((token: Token | null) => {
    setTokenState(token);
  }, []);

  const balancesWithTokens = useMemo(() => {
    if (!portfolio || !portfolio.tokens) return [];
    return portfolio.tokens.map((t) => {
      return {
        token: tokens[t.symbol.toUpperCase()],
        balance: t.balance,
        usdPrice: t.usdPrice,
      };
    });
  }, [portfolio, tokens]);

  const handleClearHistory = useCallback(async () => {
    if (!confirm('Are you sure you want to clear your chat history?')) {
      return;
    }

    try {
      const response = await fetch('/api/delete-history', {
        method: 'DELETE',
      });
      if (response.ok) {
        resetMessages();
        resetPrompts();
        setHistoryKey(prev => prev + 1); // Force History component to reload
      } else {
        console.error('Failed to clear history:', response.statusText);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, [resetMessages, resetPrompts]);

  return (
    <Dialog open={drawerLeftOpen} onClose={() => {
      setDrawerLeftOpen(false);
      setToken(null);
      setShowRecommendations(false);
    }} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-4xl transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute right-0 top-0 -mr-8 flex pl-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:pl-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerLeftOpen(false);
                      setToken(null);
                      setShowRecommendations(false);
                    }}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className={`flex h-full flex-col overflow-y-scroll py-6 shadow-xl ${styles.background} ${styles.text}`}>
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold">{/* title area */}</DialogTitle>
                </div>
                <div className="relative mt-6 px-4 sm:px-6 flex flex-col h-full">
                  {/* Recommendations View */}
                  {!token && showRecommendations && (
                    <Recommendations />
                  )}

                  {/* Portfolio Sections */}
                  {!token && !showRecommendations && <PortfolioSection
                    balancesWithTokens={balancesWithTokens}
                    hiro={hiro}
                    loading={loading}
                    setToken={setToken}
                  />}
                  {!token && !showRecommendations && portfolio && portfolio.positions && portfolio.positions.length > 0 && (
                    <LiquidityPositionsSection
                      positions={portfolio.positions}
                    />
                  )}
                  {!token && !showRecommendations && portfolio && portfolio.aave && portfolio.aave.length > 0 && (
                    <AaveLendingSection aave={portfolio.aave} />
                  )}
                  {!token && !showRecommendations && portfolio && portfolio.aave && portfolio.aave.some(item => parseFloat(item.variableDebt) > 0) && (
                    <AaveBorrowSection aave={portfolio.aave} />
                  )}
                  {!token && !showRecommendations && !portfolio && <MarketDataSection market={market} setToken={setToken} />}

                  {/* Token Chart */}
                  {token && <TokenData token={token} hours={200} exit={() => setToken(null)} />}

                  {/* Spacer to push bottom content down */}
                  <div className="flex-grow"></div>

                  {/* Chat History Section - At bottom */}
                  {!token && !showRecommendations && (
                    <nav className="flex flex-col mb-4">
                      <div className='flex justify-between mb-2'>
                        <div className='bold'>History</div>
                        <div><button className={styles.buttonSm} onClick={handleClearHistory}>Clear</button></div>
                      </div>
                      <History key={historyKey} />
                    </nav>
                  )}

                  {/* Theme Toggle - Always at very bottom */}
                  {!token && !showRecommendations && <div className='pt-4'><ThemeToggle /></div>}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

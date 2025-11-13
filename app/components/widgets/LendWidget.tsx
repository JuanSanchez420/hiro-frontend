import React, { useEffect, useMemo, useState } from "react";
import formatNumber from "@/app/utils/formatNumber";
import SearchableSelect from "../SearchableSelect";
import TOKENS from "@/app/utils/tokens.json";
import { useThemeContext, useWidgetContext } from "@/app/context/GlobalContext";
import { usePromptsContext } from "@/app/context/PromptsContext";
import { usePortfolioContext } from "@/app/context/PortfolioContext";
import { pools as AAVE_POOLS } from "@/app/utils/aavePools";

interface AavePool {
  token: string;
  depositAPY: string;
  variableBorrowAPY: string;
  stableBorrowAPY: string;
  utilizationRate: string;
  totalSupplied: string;
  totalBorrowed: string;
  availableLiquidity: string;
}

const LendWidget = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState("WETH");
  const [action, setAction] = useState<"add" | "remove">("add");
  const [aavePools, setAavePools] = useState<AavePool[]>([]);
  const [loadingAprs, setLoadingAprs] = useState(false);

  const { addPrompt, } = usePromptsContext()
  const { setWidget } = useWidgetContext();
  const { styles } = useThemeContext();
  const { portfolio } = usePortfolioContext();

  const handleLend = () => {
    if (!fromAmount || !fromToken) {
      alert("Please fill in all fields");
      return;
    }

    const numAmount = Number(fromAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    const balance = Number(balance0);
    if (balance <= 0) {
      alert("You have no balance for this token");
      return;
    }

    if (numAmount > balance) {
      alert("Insufficient balance");
      return;
    }

    if (confirm(`Lend ${fromAmount} of ${fromToken} in Aave?`)) {
      addPrompt(`Lend ${fromAmount} of ${fromToken} in Aave`);
      setWidget(null);
    }
  };

  const handleWithdraw = (token: string) => {
    if (confirm(`Withdraw ${token} from Aave?`)) {
      addPrompt(`Withdraw ${token} from Aave`)
      setWidget(null)
    }
  };

  const aavePositions = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.aave
  }, [portfolio])

  const balance0 = useMemo(() => {
    if (!portfolio) return 0
    return portfolio.tokens.find(b => b.symbol === fromToken)?.balance || 0
  }, [fromToken, portfolio])

  const isValidAmount = useMemo(() => {
    if (!fromAmount) return false;
    const numAmount = Number(fromAmount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    // Check if user has sufficient balance
    const balance = Number(balance0);
    return balance > 0 && numAmount <= balance;
  }, [fromAmount, balance0])


  useEffect(() => {
    setFromToken(portfolio?.tokens[0]?.symbol || "WETH")
  }, [portfolio])

  useEffect(() => {
    const fetchAavePools = async () => {
      setLoadingAprs(true);
      try {
        const response = await fetch('/api/aave-aprs');
        if (response.ok) {
          const data = await response.json();
          setAavePools(data.pools || []);
        } else {
          console.error('Failed to fetch Aave APRs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching Aave APRs:', error);
      } finally {
        setLoadingAprs(false);
      }
    };

    fetchAavePools();
  }, []);

  const tokenList = useMemo(() => {

    const portfolioTokens = new Set(portfolio?.tokens.map(t => t.symbol) || []);

    const aavePlusETH = Object.keys(AAVE_POOLS).concat("ETH");

    return aavePlusETH
      .map((key) => {
        const token = TOKENS[key as keyof typeof TOKENS];
        return { label: token.symbol, value: token.symbol };
      })
      .sort((a, b) => {
        const aInPortfolio = portfolioTokens.has(a.value);
        const bInPortfolio = portfolioTokens.has(b.value);
        // If both are in portfolio or both are not, retain their order
        if (aInPortfolio === bInPortfolio) return 0;
        // Otherwise, sort portfolio tokens to the top
        return aInPortfolio ? -1 : 1;
      });
  }, [portfolio]);


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center space-x-4 mb-4">
        <button
          onClick={() => setAction("add")}
          className={`px-4 py-2 rounded-md font-medium ${action === "add"
            ? "bg-emerald-400 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Lend
        </button>
        <button
          onClick={() => setAction("remove")}
          className={`px-4 py-2 rounded-md font-medium ${action === "remove"
            ? "bg-emerald-400 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Withdraw
        </button>
      </div>

      {/* Aave APRs Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Aave Pool APRs</h3>
        {loadingAprs ? (
          <div className="flex justify-center p-4">Loading APRs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${styles.text}`}>
                  <th className="text-left p-2">Token</th>
                  <th className="text-left p-2">Deposit APY</th>
                  <th className="text-left p-2">Borrow APY</th>
                </tr>
              </thead>
              <tbody>
                {aavePools.map((pool, index) => (
                  <tr key={index} className={`border-b ${styles.text}`}>
                    <td className="p-2 font-medium">{pool.token}</td>
                    <td className="p-2 text-green-600">{pool.depositAPY}</td>
                    <td className="p-2 text-red-500">{pool.variableBorrowAPY}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* From Token */}
      {action === "add" && <div>
        <h3 className="text-lg font-semibold mb-4">Lend</h3>
        <div className="mb-6">
          <div>
            <div className="flex justify-between">
              <div className="">Amount</div>
              <div className="text-xs italic">Balance: {formatNumber(balance0)}</div>
            </div>
            <div className="mt-2">
              <div className="rounded-md outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
                <div className="flex items-center pl-3 py-3">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    autoComplete="off"
                    className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-lg placeholder:text-gray-400 focus:outline focus:outline-0 ${styles.background} ${styles.text}`}
                  />
                  <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                    <SearchableSelect options={tokenList} value={{ label: fromToken, value: fromToken }} onChange={(e) => {
                      setFromToken(e.value)
                      setFromAmount("")
                    }} />
                  </div>
                </div>
                <div className="flex justify-between px-3 pb-2">
                  {[25, 50, 75, 100].map((percent, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (percent === 100) {
                          setFromAmount(balance0.toString());
                        } else {
                          setFromAmount((Number(balance0) * percent / 100).toString());
                        }
                      }}
                      className={styles.button}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lend Button */}
        <button
          type="button"
          onClick={handleLend}
          disabled={!isValidAmount}
          className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Lend
        </button>
      </div>}

      {action === "remove" && (
        <div id="remove-liquidity">
          <h3 className="text-lg font-semibold mb-4">Withdraw</h3>
          <div className="space-y-4">
            {aavePositions.map((item, index) => (
              <div key={index} className="flex tems-center justify-between">
                <div className="text-sm">
                  <div>{`${item.token}`}</div>
                  <div className="italic text-xs">{`Balance: ${item.balance}`}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleWithdraw(item.token)}
                  className={styles.buttonSm}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LendWidget;

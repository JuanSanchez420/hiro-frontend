import React, { useEffect, useMemo, useState } from "react";
import formatNumber from "@/app/utils/formatNumber";
import SearchableSelect from "../SearchableSelect";
import TOKENS from "@/app/utils/tokens.json";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { usePromptsContext } from "@/app/context/PromptsContext";
import { usePortfolioContext } from "@/app/context/PortfolioContext";
import { pools as AAVE_POOLS } from "@/app/utils/aavePools";

const LendWidget = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState("WETH");
  const [action, setAction] = useState<"add" | "remove">("add");

  const { addPrompt, } = usePromptsContext()
  const { setWidget, styles } = useGlobalContext();
  const { portfolio } = usePortfolioContext();

  const handleBorrow = () => {
    if (!fromAmount || !fromToken) {
      alert("Please fill in all fields")
      return
    }
    if (confirm(`Borrow ${fromAmount} of ${fromToken} in Aave?`)) {
      addPrompt(`Borrow ${fromAmount} of ${fromToken} in Aave`)
      setWidget(null)
    }
  };

  const handleRepay = (t: string) => {
    if (confirm(`Repay full ${t} debt from Aave?`)) {
      addPrompt(`Repay full ${t} debt from Aave`)
      setWidget(null)
    }
  };

  const aavePositionsWithTokens = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.aave.map((item) => ({
      ...item,
      token: TOKENS[item.token as keyof typeof TOKENS],
    })).filter((item) => item.usageAsCollateral)
  }, [portfolio])

  const balance0 = useMemo(() => {
    if (!portfolio) return 0
    return portfolio.tokens.find(b => b.symbol === fromToken)?.balance || 0
  }, [fromToken, portfolio])


  useEffect(() => {
    setFromToken(portfolio?.tokens[0]?.symbol || "WETH")
  }, [portfolio])

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

  const ButtonRow = ({ handler }: { handler: React.Dispatch<React.SetStateAction<string>> }) => {
    const percents = [25, 50, 75, 100]
    return (
      <div className="flex justify-between my-5">
        {percents.map((percent, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handler((Number(balance0) * percent / 100).toString())}
            className={styles.button}
          >
            {percent}%
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center space-x-4 mb-4">
        <button
          onClick={() => setAction("add")}
          className={`px-4 py-2 rounded-md font-medium ${action === "add"
            ? "bg-emerald-400 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Borrow
        </button>
        <button
          onClick={() => setAction("remove")}
          className={`px-4 py-2 rounded-md font-medium ${action === "remove"
            ? "bg-emerald-400 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Repay
        </button>
      </div>

      {action === "add" && <div>
        <h3 className="text-lg font-semibold mb-4">Borrow</h3>
        <div className="mb-6">
          <div>
            <div className="flex justify-between">
              <div className="">Amount</div>
              <div className="text-sm italic">Balance: {formatNumber(balance0)}</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center rounded-md pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  autoComplete="off"
                  className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-base placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 ${styles.background} ${styles.text}`}
                />
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <SearchableSelect options={tokenList} value={{ label: fromToken, value: fromToken }} onChange={(e) => {
                    setFromToken(e.value)
                    setFromAmount("")
                  }} />
                </div>
              </div>
            </div>
            <div className="my-1">
              <ButtonRow handler={setFromAmount} />
            </div>
          </div>
        </div>

        {/* Lend Button */}
        <button
          type="button"
          onClick={handleBorrow}
          className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        >
          Lend
        </button>
      </div>}

      {action === "remove" && (
        <div id="remove-liquidity">
          <h3 className="text-lg font-semibold mb-4">Repay</h3>
          <div className="space-y-4">
            {aavePositionsWithTokens.map((item, index) => (
              <div key={index} className="flex tems-center justify-between">
                <div className="text-sm">
                  <div>{`${item.token.symbol}`}</div>
                  <div className="italic text-sm">{`Balance: ${item.variableDebt}`}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRepay(item.token.symbol)}
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

import formatNumber from "@/app/utils/formatNumber";
import React, { useMemo, useState } from "react";
import SearchableSelect from "../SearchableSelect";
import { SimpleLiquidityPosition } from "@/app/types";
import TOKENS from "@/app/utils/tokens.json";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { usePromptsContext } from "@/app/context/PromptsContext";
import { usePortfolioContext } from "@/app/context/PortfolioContext";
import Tooltip from "../Tooltip";

export default function LiquidityWidget() {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [token0, setToken0] = useState("WETH");
  const [token1, setToken1] = useState("USDC");
  const [width, setWidth] = useState<"5%" | "10%" | "15%">("15%");
  const [action, setAction] = useState<"add" | "remove">("add");

  const { addPrompt } = usePromptsContext();
  const { setWidget, styles } = useGlobalContext();
  const { portfolio } = usePortfolioContext();

  const handleAddLiquidity = () => {
    if (confirm(`Add liquidity with ${amount0} ${token0} and ${amount1} ${token1} with a ${width} range?`)) {
      addPrompt(`Add liquidity with ${amount0} ${token0} and ${amount1} ${token1} ${width} range`);
      setWidget(null);
    }
  };

  const handleRemoveLiquidity = (position: SimpleLiquidityPosition) => {
    if (confirm(`Remove liquidity for ${position.token0}/${position.token1}?`)) {
      addPrompt(`Remove liquidity for ${position.token0}/${position.token1}, index ${position.index}`);
      setWidget(null);
    }
  }

  const balance0 = useMemo(() => {
    if (!portfolio || !portfolio.tokens) return "0";
    return portfolio.tokens.find((b) => b.symbol === token0)?.balance || "0";
  }, [token0, portfolio]);

  const balance1 = useMemo(() => {
    if (!portfolio || !portfolio.tokens) return "0";
    return portfolio.tokens.find((b) => b.symbol === token1)?.balance || "0";
  }, [token1, portfolio]);


  const liquidityPositions = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.positions
  }, [portfolio])

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

  const formatUnclaimedFees = (position: SimpleLiquidityPosition) => {
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

  const tokenList = useMemo(() => {
    const portfolioTokens = new Set(portfolio?.tokens.map(t => t.symbol) || []);

    return Object.keys(TOKENS)
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
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center space-x-4 mb-4">
        <button
          onClick={() => setAction("add")}
          className={`px-4 py-2 rounded-md font-medium ${action === "add"
            ? "bg-emerald-400 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setAction("remove")}
          className={`px-4 py-2 rounded-md font-medium ${action === "remove"
            ? "bg-emerald-400 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Remove Liquidity
        </button>
      </div>


      {action === "add" && (
        <div id="add-liquidity">
          {/* Token0 */}
          <div className="mb-4">
            <div>
              <div className="flex justify-between">
                <div>Token 0</div>
                <div className="text-xs italic">Balance: {formatNumber(balance0)}</div>
              </div>
              <div className="mt-2">
                <div className="rounded-md outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
                  <div className="flex items-center pl-3 py-3">
                    <input
                      id="price0"
                      name="price0"
                      type="text"
                      placeholder="0.00"
                      value={amount0}
                      onChange={(e) => setAmount0(e.target.value)}
                      autoComplete="off"
                      className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-lg placeholder:text-gray-400 focus:outline-0 ${styles.background} ${styles.text}`}
                    />
                    <div className="grid shrink-0 grid-cols-1">
                      <SearchableSelect
                        options={tokenList}
                        value={{ label: token0, value: token0 }}
                        onChange={(e) => {
                          setToken0(e.value);
                          setAmount0("");
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between px-3 pb-2">
                    {[25, 50, 75, 100].map((percent, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAmount0((Number(balance0) * percent / 100).toString())}
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

          {/* Token1 */}
          <div className="mb-4">
            <div className="flex justify-between">
              <div>Token 1</div>
              <div className="text-xs italic">Balance: {formatNumber(balance1)}</div>
            </div>
            <div className="mt-2">
              <div className="rounded-md outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
                <div className="flex items-center pl-3 py-3">
                  <input
                    id="price1"
                    name="price1"
                    type="text"
                    placeholder="0.00"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    autoComplete="off"
                    className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-lg placeholder:text-gray-400 focus:outline-0 ${styles.background} ${styles.text}`}
                  />
                  <div className="grid shrink-0 grid-cols-1">
                    <SearchableSelect
                      options={tokenList}
                      value={{ label: token1, value: token1 }}
                      onChange={(e) => {
                        setToken1(e.value);
                        setAmount1("");
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between px-3 pb-2">
                  {[25, 50, 75, 100].map((percent, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAmount1((Number(balance1) * percent / 100).toString())}
                      className={styles.button}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between my-5">
            <Tooltip content="Higher APR, higher divergence loss." position="right"><button className={`${width === "5%" ? styles.buttonSelectedSm : styles.buttonSm}`} onClick={() => setWidth("5%")}>
              Aggressive
            </button></Tooltip>
            <Tooltip content="Medium APR, medium divergence loss." position="top"><button className={`${width === "10%" ? styles.buttonSelectedSm : styles.buttonSm}`} onClick={() => setWidth("10%")}>
              Standard
            </button></Tooltip>
            <Tooltip content="Lower APR, lower divergence loss." position="left"><button className={`${width === "15%" ? styles.buttonSelectedSm : styles.buttonSm}`} onClick={() => setWidth("15%")}>
              Defensive
            </button></Tooltip>
          </div>

          {/* Add Liquidity Button */}
          <button
            type="button"
            onClick={handleAddLiquidity}
            className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            Add
          </button>
        </div>
      )}

      {action === "remove" && (
        <div id="remove-liquidity">
          <h3 className="text-lg font-semibold mb-4">Remove Liquidity</h3>
          <div className="space-y-4">
            {liquidityPositions.map((item, index) => (
              <div key={index} className="flex tems-center justify-between">
                <div className="text-sm">
                  <div>{`${item.token0}/${item.token1}`}</div>
                  <div className="italic text-xs">{`Value: ${formatUsdValue(item.positionValueUSD)}`}</div>
                  <div className="italic text-xs">{`APR: ${formatAprValue(item.apr)}`}</div>
                  <div className="italic text-xs">{`Unclaimed: ${formatUnclaimedFees(item)}`}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLiquidity(item)}
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
}

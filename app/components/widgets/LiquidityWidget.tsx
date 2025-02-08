import usePortfolio from "@/app/hooks/usePortfolio";
import formatNumber from "@/app/utils/formatNumber";
import { styles } from "@/app/utils/styles";
import React, { useMemo, useState } from "react";
import { useMessagesContext } from "@/app/context/Context";
import SearchableSelect from "../SearchableSelect";
import { formatEther } from "viem";
import { SimpleLiquidityPosition } from "@/app/types";
import TOKENS from "@/app/utils/tokens.json";

export default function LiquidityWidget() {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [token0, setToken0] = useState("WETH");
  const [token1, setToken1] = useState("USDC");
  const [width, setWidth] = useState<"5%" | "10%" | "15%">("15%");
  const [action, setAction] = useState<"add" | "remove">("add");

  const { addMessage, setWidget } = useMessagesContext();
  const { portfolio } = usePortfolio();

  const handleAddLiquidity = () => {
    if (confirm(`Add liquidity with ${amount0} ${token0} and ${amount1} ${token1} with a ${width} range?`)) {
      addMessage(`Add liquidity with ${amount0} ${token0} and ${amount1} ${token1} ${width} range`, "user", true);
      setWidget(null);
    }
  };

  const handleRemoveLiquidity = (position: SimpleLiquidityPosition) => {
    if (confirm(`Remove liquidity for ${position.token0}/${position.token1}?`)) {
      addMessage(`Remove liquidity for ${position.token0}/${position.token1} and index ${position.index}`, "user", true);
      setWidget(null);
    }
  }

  const balance0 = useMemo(() => {
    if (!portfolio) return "0";
    return portfolio.tokens.find((b) => b.symbol === token0)?.balance || "0";
  }, [token0, portfolio]);

  const balance1 = useMemo(() => {
    if (!portfolio) return "0";
    return portfolio.tokens.find((b) => b.symbol === token1)?.balance || "0";
  }, [token1, portfolio]);

  const ButtonRow = ({ handler, balance }: { handler: React.Dispatch<React.SetStateAction<string>>, balance: string }) => {
    const percents = [25, 50, 75, 100];
    return (
      <div className="flex justify-between my-5">
        {percents.map((percent, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handler((Number(balance) * percent / 100).toString())}
            className={styles.button}
          >
            {percent}%
          </button>
        ))}
      </div>
    );
  };

  const liquidityPositions = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.positions
  }, [portfolio])

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
    <div className="bg-white w-full max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-4">
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
          <div className="text-sm italic mb-3">
            Note: Hiro will try to add a 50/50 split of the two tokens (ex: 1 WETH and $3,700 USDC). You will be refunded anything that cannot be added. Will upgrade this soon.
          </div>
          {/* Token0 */}
          <div className="mb-4">
            <div>
              <div className="flex justify-between">
                <div>Token 0</div>
                <div className="text-sm italic">Balance: {formatNumber(balance0)}</div>
              </div>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
                  <input
                    id="price0"
                    name="price0"
                    type="text"
                    placeholder="0.00"
                    value={amount0}
                    onChange={(e) => setAmount0(e.target.value)}
                    autoComplete="off"
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-0 sm:text-sm/6"
                  />
                  <div className="grid shrink-0 grid-cols-1">
                    <SearchableSelect
                      options={tokenList}
                      onChange={(e) => {
                        setToken0(e.value);
                        setAmount0("");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="my-1">
              <ButtonRow handler={setAmount0} balance={balance0} />
            </div>
          </div>

          {/* Token1 */}
          <div className="mb-4">
            <div className="flex justify-between">
              <div>Token 1</div>
              <div className="text-sm italic">Balance: {formatNumber(balance1)}</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
                <input
                  id="price1"
                  name="price1"
                  type="text"
                  placeholder="0.00"
                  value={amount1}
                  onChange={(e) => setAmount1(e.target.value)}
                  autoComplete="off"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-0 sm:text-sm/6"
                />
                <div className="grid shrink-0 grid-cols-1">
                  <SearchableSelect
                    options={tokenList}
                    onChange={(e) => {
                      setToken1(e.value);
                      setAmount1("");
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="my-1">
              <ButtonRow handler={setAmount1} balance={balance1} />
            </div>
          </div>

          <div className="flex justify-between my-5">
            <button className={`${styles.buttonSm} ${width === "5%" ? "bg-gray-200" : ""}`} onClick={() => setWidth("5%")}>
              Narrow (5%)
            </button>
            <button className={`${styles.buttonSm} ${width === "10%" ? "bg-gray-200" : ""}`} onClick={() => setWidth("10%")}>
              Medium (10%)
            </button>
            <button className={`${styles.buttonSm} ${width === "15%" ? "bg-gray-200" : ""}`} onClick={() => setWidth("15%")}>
              Wide (15%)
            </button>
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
                  <div className="italic text-sm">{`Balance: ${formatEther(item.liquidity)}`}</div>
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
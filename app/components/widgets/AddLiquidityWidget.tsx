import usePortfolio from "@/app/hooks/usePortfolio";
import formatNumber from "@/app/utils/formatNumber";
import { styles } from "@/app/utils/styles";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import React, { useMemo, useState } from "react";
import { widgetOptions } from "./widgetOptions";
import { useMessagesContext } from "@/app/context/Context";

const AddLiquidityWidget = () => {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [token0, setToken0] = useState("WETH");
  const [token1, setToken1] = useState("USDC");
  const [width, setWidth] = useState<"5%" | "10%" | "15%">("15%");

  const { addMessage, setWidget } = useMessagesContext()
  const { balances } = usePortfolio()

  const handleAddLiquidity = () => {
    if (confirm(`Add liquidity with ${amount0} ${token0} and ${amount1} ${token1} with a ${width} range?`)) {
      addMessage(`Add liquidity with ${amount0} ${token0} and ${amount1} ${token1} ${width} range`, "user", true)
      setWidget(widgetOptions[widgetOptions.length - 1])
    }
  };

  const balance0 = useMemo(() => {
    return balances.find(b => b.symbol === token0)?.balance || "0"
  }, [token0, balances])

  const balance1 = useMemo(() => {
    return balances.find(b => b.symbol === token1)?.balance || "0"
  }, [token1, balances])

  const ButtonRow = ({ handler, balance }: { handler: React.Dispatch<React.SetStateAction<string>>, balance: string }) => {
    const percents = [25, 50, 75, 100]
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
    )
  }

  return (
    <div className="bg-white w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Add Liquidity</h2>
      {/* From Token */}
      <div className="mb-4">
        <div>
          <div className="flex justify-between">
            <div className="">Token 0</div>
            <div className="text-sm italic">Balance: {formatNumber(balance0)}</div>
          </div>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={amount0}
                onChange={(e) => setAmount0(e.target.value)}
                autoComplete="off"
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
              <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                <select
                  id="currency"
                  name="currency"
                  aria-label="Currency"
                  value={token0}
                  onChange={(e) => {
                    setToken0(e.target.value)
                    setAmount0("")
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pl-3 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                >
                  <option value="USDC">USDC</option>
                  <option value="WETH">WETH</option>
                  <option value="AERO">AERO</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="my-1">
          <ButtonRow handler={setAmount0} balance={balance0} />
        </div>
      </div>

      {/* To Token */}
      <div className="mb-4">
        <div className="flex justify-between">
          <div className="">Token 1</div>
          <div className="text-sm italic">Balance: {formatNumber(balance1)}</div>
        </div>
        <div className="mt-2">
          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
            <input
              id="price"
              name="price"
              type="text"
              placeholder="0.00"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              autoComplete="off"
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            />
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select
                id="currency"
                name="currency"
                aria-label="Currency"
                value={token1}
                onChange={(e) => {
                  setToken1(e.target.value)
                  setAmount1("")
                }}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pl-3 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
              >
                <option value="USDC">USDC</option>
                <option value="WETH">WETH</option>
                <option value="AERO">AERO</option>
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </div>
        </div>
        <div className="my-1">
          <ButtonRow handler={setAmount1} balance={balance1} />
        </div>
      </div>
      <div className="flex justify-between my-5">
        <button className={`${styles.buttonSm} ${width === "5%" ? "bg-gray-200" : ""}`} onClick={() => setWidth("5%")}>Narrow (5%)</button>
        <button className={`${styles.buttonSm} ${width === "10%" ? "bg-gray-200" : ""}`} onClick={() => setWidth("10%")}>Medium (10%)</button>
        <button className={`${styles.buttonSm} ${width === "15%" ? "bg-gray-200" : ""}`} onClick={() => setWidth("15%")}>Wide (15%)</button>
      </div>
      {/* Swap Button */}
      <button
        type="button"
        onClick={handleAddLiquidity}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        Add Liquidity
      </button>
    </div>
  );
};

export default AddLiquidityWidget;
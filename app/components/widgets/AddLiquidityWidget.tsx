import { ChevronDownIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

const AddLiquidityWidget = () => {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [token0, setToken0] = useState("WETH");
  const [token1, setToken1] = useState("USDC");

  const handleAddLiquidity = () => {
    alert(`Adding liquidity with ${amount0} ${token0} and ${amount1} ${token1}`);
  };

  return (
    <div className="bg-white border rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Add Liquidity</h2>
      {/* From Token */}
      <div className="mb-4">
        <div>
          <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
            Token 0
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={amount0}
                onChange={(e) => setAmount0(e.target.value)}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
              <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                <select
                  id="currency"
                  name="currency"
                  aria-label="Currency"
                  value={token0}
                  onChange={(e) => setToken0(e.target.value)}
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
      </div>

      {/* To Token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Token 1</label>
        <div className="mt-2">
          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
            <input
              id="price"
              name="price"
              type="text"
              placeholder="0.00"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            />
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select
                id="currency"
                name="currency"
                aria-label="Currency"
                value={token1}
                onChange={(e) => setToken1(e.target.value)}
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
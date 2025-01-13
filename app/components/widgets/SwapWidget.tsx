import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useMessagesContext } from "@/app/context/Context";
import { widgetOptions } from "./widgetOptions";

const SwapWidget = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState("WETH");
  const [toToken, setToToken] = useState("USDC");

  const { addMessage, setWidget } = useMessagesContext()

  const handleSwap = () => {
    addMessage(`Swap ${fromAmount} of ${fromToken} to ${toToken}`, "user", true)
    setWidget(widgetOptions[4])
  };

  return (
    <div className="bg-white border rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Swap</h2>
      {/* From Token */}
      <div className="mb-4">
        <div>
          <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
            From
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
              <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                <select
                  id="currency"
                  name="currency"
                  aria-label="Currency"
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700">To</label>
        <div className="mt-2">
          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
            <input
              id="price"
              name="price"
              type="text"
              placeholder="0.00"
              disabled
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            />
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select
                id="currency"
                name="currency"
                aria-label="Currency"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
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
        onClick={handleSwap}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        Swap
      </button>
    </div>
  );
};

export default SwapWidget;
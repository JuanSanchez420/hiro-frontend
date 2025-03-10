import React, { useEffect, useMemo, useState } from "react";
import usePortfolio from "@/app/hooks/usePortfolio";
import formatNumber from "@/app/utils/formatNumber";
import { styles } from "@/app/utils/styles";
import SearchableSelect from "../SearchableSelect";
import TOKENS from "@/app/utils/tokens.json";
import { config } from "@/app/config";
import { getBalance } from "wagmi/actions";
import { useAccount } from "wagmi";
import { formatEther } from "viem";

const SignupWidget = () => {
  const account = useAccount()
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState("0");
  const signupToken = "ETH"

  const { portfolio } = usePortfolio()

  const handleSignup = () => {
    if (!amount || !signupToken) {
      alert("Please fill in all fields")
      return
    }
  };

  const getETHBalance = async () => {
    const data = await getBalance(config, { address: account?.address as `0x${string}` })
    setBalance(formatEther(data.value))
  }

  useEffect(() => {
    getETHBalance()
  }
  , [])

  const balance0 = useMemo(() => {
    if (!portfolio) return 0
    return portfolio.tokens.find(b => b.symbol === signupToken)?.balance || 0
  }, [signupToken, portfolio])

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
    <div className="bg-white w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Create your Hiro!</h2>
      <div className="text-sm">
      Creating a Hiro costs 0.01 ETH, which will be converted to Hiro tokens to cover gas and inference fees. You can send additional ETH now for Hiro to trade with (this won&apos;t be converted to Hiro tokens), or you can send it later.
      </div>
      {/* From Token */}
      <div className="mb-6">
        <div>
          <div className="flex justify-between">
            <div className="">&nbsp;</div>
            <div className="text-sm italic">Balance: {formatNumber(balance0)}</div>
          </div>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoComplete="off"
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
              <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                <SearchableSelect options={tokenList} value={{ label: signupToken, value: signupToken }} onChange={()=>null} />
              </div>
            </div>
          </div>
          <div className="my-1">
            <ButtonRow handler={setAmount} />
          </div>
        </div>
      </div>

      {/* Signup Button */}
      <button
        type="button"
        onClick={handleSignup}
        className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
      >
        Signup
      </button>
    </div>
  );
};

export default SignupWidget;
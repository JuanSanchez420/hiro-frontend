import React, { useMemo, useState } from "react";
import formatNumber from "@/app/utils/formatNumber";
import SearchableSelect from "../SearchableSelect";
import TOKENS from "@/app/utils/tokens.json";
import useHiro from "@/app/hooks/useHiro";
import { parseEther, parseUnits } from "viem";
import { usePortfolioContext } from "@/app/context/PortfolioContext";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { Spinner } from "../Spinner";

const WithdrawWidget = () => {
  const [amount, setAmount] = useState("");
  const [withdrawToken, setWithdrawToken] = useState("ETH");
  const { withdraw, withdrawETH } = useHiro();
  const { setWidget, styles } = useGlobalContext()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const { portfolio, fetchPortfolio } = usePortfolioContext()

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true)
      if (!amount || !withdrawToken) {
        alert("Please fill in all fields")
        return
      }
      if (withdrawToken === "ETH") {
        await withdrawETH(parseEther(amount))

      } else {
        const t = TOKENS[withdrawToken as keyof typeof TOKENS]
        await withdraw(t, parseUnits(amount, t.decimals))
      }
      fetchPortfolio()
      setWidget(null)
    } catch (error) {
      console.error(error)
    } finally {
      setIsWithdrawing(false)
    }

  };

  const balance0 = useMemo(() => {
    if (!portfolio) return 0
    return portfolio.tokens.find(b => b.symbol === withdrawToken)?.balance || 0
  }, [withdrawToken, portfolio])

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
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Withdraw</h2>
      {/* From Token */}
      <div className="mb-6">
        <div>
          <div className="flex justify-between">
            <div className="">Token</div>
            <div className="text-sm italic">Balance: {formatNumber(balance0)}</div>
          </div>
          <div className="mt-2">
            <div className="flex items-center rounded-md pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-emerald-600">
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoComplete="off"
                className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-base placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 ${styles.background} ${styles.text}`}
              />
              <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                <SearchableSelect options={tokenList} value={{ label: withdrawToken, value: withdrawToken }} onChange={(e) => {
                  setWithdrawToken(e.value.toUpperCase())
                  setAmount("")
                }} />
              </div>
            </div>
          </div>
          <div className="my-1">
            <ButtonRow handler={setAmount} />
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <button
        type="button"
        onClick={handleWithdraw}
        className="flex justify-center w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
      >
        {isWithdrawing && <Spinner />}<span>Withdraw</span>
      </button>
    </div>
  );
};

export default WithdrawWidget;
import React, { useMemo, useState } from "react";
import formatNumber from "@/app/utils/formatNumber";
import SearchableSelect from "../SearchableSelect";
import useHiroFactory from "@/app/hooks/useHiroFactory";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { usePortfolioContext } from "@/app/context/PortfolioContext";
import { Spinner } from "../Spinner";

const SignupWidget = () => {
  const { signUp, status } = useHiroFactory()
  const { setWidget, styles } = useGlobalContext()
  const [amount, setAmount] = useState("0");
  const signupToken = "ETH"

  const { portfolio } = usePortfolioContext();

  const handleSignup = async () => {
    if (amount === undefined || amount === null || amount === "") {
      alert("Please enter an amount (0 is valid)");
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      alert("Please enter a valid amount (must be 0 or greater)");
      return;
    }

    // Only check balance if depositing more than 0
    if (numAmount > 0) {
      const balance = Number(balance0);
      if (numAmount > balance) {
        alert("Insufficient balance");
        return;
      }
    }

    await signUp(amount);
    setWidget(null);
  };

  const balance0 = useMemo(() => {
    if (!portfolio) return "0"
    return portfolio.userWalletEthBalance || "0"
  }, [portfolio])

  const isValidAmount = useMemo(() => {
    if (amount === undefined || amount === null || amount === "") return false;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) return false;

    // If depositing more than 0, check balance
    if (numAmount > 0) {
      const balance = Number(balance0);
      return numAmount <= balance;
    }

    // 0 is valid
    return true;
  }, [amount, balance0])

  const tokenList = useMemo(() => {
    return [{ label: "ETH", value: "ETH" }]
  }, []);


  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Create your Hiro!</h2>
      <div className="text-sm">
        You can send ETH now for Hiro to trade with, or you can send it later.
      </div>
      {/* From Token */}
      <div className="mb-6">
        <div>
          <div className="flex justify-between">
            <div className="">&nbsp;</div>
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoComplete="off"
                  className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-lg placeholder:text-gray-400 focus:outline focus:outline-0 ${styles.background} ${styles.text}`}
                />
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <SearchableSelect options={tokenList} value={{ label: signupToken, value: signupToken }} onChange={() => null} />
                </div>
              </div>
              <div className="flex justify-between px-3 pb-2">
                {[25, 50, 75, 100].map((percent, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (percent === 100) {
                        setAmount(balance0);
                      } else {
                        setAmount((Number(balance0) * percent / 100).toString());
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

      {/* Signup Button */}
      <button
        type="button"
        onClick={handleSignup}
        disabled={!isValidAmount || status === "CREATING"}
        className={`flex justify-center w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {status === "NOT_CREATED" && <span>CREATE YOUR HIRO</span>}
        {status === "CREATING" && <div className="flex"><Spinner /><span>TRAINING YOUR HIRO</span></div>}
      </button>
    </div>
  );
};

export default SignupWidget;

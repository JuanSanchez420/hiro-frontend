import React, { useMemo, useState } from "react";
import formatNumber from "@/app/utils/formatNumber";
import { styles } from "@/app/utils/styles";
import SearchableSelect from "../SearchableSelect";
import useHiroFactory from "@/app/hooks/useHiroFactory";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { usePortfolioContext } from "@/app/context/PortfolioContext";

const SignupWidget = () => {
  const { signUp } = useHiroFactory()
  const { setWidget } = useGlobalContext()
  const [amount, setAmount] = useState("0");
  const signupToken = "ETH"

  const { portfolio } = usePortfolioContext();

  const handleSignup = async () => {
    if (!amount) {
      alert("Please fill in all fields")
      return
    }
    await signUp(amount)
    setWidget(null)
  };

  const balance0 = useMemo(() => {
    if (!portfolio) return "0"
    return portfolio.balance || "0"
  }, [portfolio])

  const tokenList = useMemo(() => {
    return [{ label: "ETH", value: "ETH" }]
  }, []);

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
                <SearchableSelect options={tokenList} value={{ label: signupToken, value: signupToken }} onChange={() => null} />
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
        CREATE YOUR HIRO
      </button>
    </div>
  );
};

export default SignupWidget;
import React, { useMemo, useState } from "react";
import formatNumber from "@/app/utils/formatNumber";
import SearchableSelect from "../SearchableSelect";
import TOKENS from "@/app/utils/tokens.json";
import useHiro from "@/app/hooks/useHiro";
import { parseEther, parseUnits, erc20Abi, getContract, maxUint256 } from "viem";
import { useThemeContext, useWidgetContext } from "@/app/context/GlobalContext";
import { usePortfolioContext } from "@/app/context/PortfolioContext";
import { Spinner } from "../Spinner";
import { useWalletClient } from "wagmi";
import { waitForTransactionReceipt } from "viem/actions";

const DepositWidget = () => {
  const { setWidget } = useWidgetContext()
  const { styles } = useThemeContext()
  const [amount, setAmount] = useState("");
  const [depositToken, setDepositToken] = useState("ETH");
  const { depositETH, hiro } = useHiro()
  const { data: client } = useWalletClient();
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const { portfolio, fetchPortfolio } = usePortfolioContext()

  const handleDeposit = async () => {
    if (!amount || !depositToken || !client || !hiro) {
      alert("Please fill in all fields");
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    const balance = Number(balance0);
    if (balance <= 0) {
      alert("You have no balance for this token");
      return;
    }

    if (numAmount > balance) {
      alert("Insufficient balance");
      return;
    }

    try {
      if (depositToken === "ETH") {
        setIsDepositing(true);
        await depositETH(parseEther(amount));
        await fetchPortfolio();
        setWidget(null);
      } else {
        // Handle ERC20 tokens
        const token = TOKENS[depositToken as keyof typeof TOKENS];
        if (!token) {
          alert("Invalid token selected");
          return;
        }

        const tokenAmount = parseUnits(amount, token.decimals);
        const tokenContract = getContract({
          abi: erc20Abi,
          address: token.address as `0x${string}`,
          client
        });

        // Check current allowance
        setIsCheckingAllowance(true);
        const currentAllowance = await tokenContract.read.allowance([
          client.account.address,
          hiro
        ]) as bigint;
        setIsCheckingAllowance(false);

        // If allowance is insufficient, request approval
        if (currentAllowance < tokenAmount) {
          setIsApproving(true);
          const approvalHash = await tokenContract.write.approve([
            hiro,
            maxUint256 // Approve unlimited to avoid future approvals
          ]);
          await waitForTransactionReceipt(client, { hash: approvalHash });
          setIsApproving(false);
        }

        // Execute the transfer
        setIsDepositing(true);
        const transferHash = await tokenContract.write.transfer([hiro, tokenAmount]);
        await waitForTransactionReceipt(client, { hash: transferHash });

        await fetchPortfolio();
        setWidget(null);
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsCheckingAllowance(false);
      setIsApproving(false);
      setIsDepositing(false);
    }
  }

  const balance0 = useMemo(() => {
    if (!portfolio) return "0"
    if (depositToken === "ETH") return portfolio.userWalletEthBalance
    return portfolio.tokens.find(b => b.symbol === depositToken)?.balance || "0"
  }, [depositToken, portfolio])

  const isValidAmount = useMemo(() => {
    if (!amount) return false;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    // Check if user has sufficient balance
    const balance = Number(balance0);
    return balance > 0 && numAmount <= balance;
  }, [amount, balance0])

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
            onClick={() => {
              if (percent === 100) {
                handler(balance0);
              } else {
                handler((Number(balance0) * percent / 100).toString());
              }
            }}
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
      <h2 className="text-lg font-semibold mb-4">Deposit</h2>
      {/* From Token */}
      <div className="mb-6">
        <div>
          <div className="flex justify-between">
            <div className="">Token</div>
            <div className="text-xs italic">Balance: {formatNumber(balance0)}</div>
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
                <SearchableSelect options={tokenList} value={{ label: depositToken, value: depositToken }} onChange={(e) => {
                  setDepositToken(e.value)
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

      {/* Deposit Button */}
      <button
        type="button"
        onClick={handleDeposit}
        disabled={!isValidAmount || isCheckingAllowance || isApproving || isDepositing}
        className="flex justify-center w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {(isCheckingAllowance || isApproving || isDepositing) && <Spinner />}
        <span>
          {isCheckingAllowance
            ? "Checking Allowance..."
            : isApproving
            ? "Approving..."
            : isDepositing
            ? "Depositing..."
            : "Deposit"}
        </span>
      </button>
    </div>
  );
};

export default DepositWidget;

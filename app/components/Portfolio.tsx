import { useMemo } from "react";
import usePortfolio from "../hooks/usePortfolio";
import tokensData from "../utils/tokens.json";
import { TokensData } from "../types";
import formatNumber from "../utils/formatNumber";

const Portfolio = () => {
  const { balances } = usePortfolio();
  const tokens: TokensData = tokensData;

  const balancesWithTokens = useMemo(() => {
    if (!balances) return [];
    return balances.map((balance) => {
      return {
        token: tokens[balance.symbol],
        balance: balance.balance,
      };
    });
  }, [balances, tokens]);

  return (
    <div>
      {balancesWithTokens.map((item) => {
        return (
          <div key={item.token.symbol}>
            <a className="grid grid-cols-4 gap-2 p-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 group rounded-md text-sm/6 font-semibold hover:cursor-pointer">
              <div>{item.token.symbol}</div>
              <div>{formatNumber(item.balance)}</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
            </a>
          </div>
        );
      })}
    </div>
  )
}

export default Portfolio;

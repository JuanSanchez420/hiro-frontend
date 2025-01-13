import { useMemo } from "react";
import usePortfolio from "../hooks/usePortfolio";
import tokensData from "../utils/tokens.json";
import { TokensData } from "../types";


const Portfolio = () => {
    const {balances} = usePortfolio();
    const tokens: TokensData = tokensData;
    
    const balancesWithTokens = useMemo(() => {
        if(!balances) return [];
        return balances.map((balance) => {
          return {
            token: tokens[balance.symbol],
            balance: balance.value,
          };
        });
      },[balances, tokens]);

    return (
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {balancesWithTokens.map((item) => (
              <li key={item.token.symbol}>
                <a
                  href="#"
                  className={
                    'text-gray-700 hover:bg-gray-50 hover:text-emerald-600 group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                  }

                >
                  
                  {item.token.symbol} - {item.balance}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    );
    }

export default Portfolio;

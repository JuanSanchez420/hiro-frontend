'use client'

import tokensData from "../../utils/tokens.json";
import { Token, TokensData } from "../../types";
import { useParams } from "next/navigation";
import CombinedChart from "@/app/components/CombinedChart";

const TokenPage = () => {
    const { symbol } = useParams()
    const tokens: TokensData = tokensData;

    const token = tokens[symbol as string] as Token;

    return (
        <div className="w-full h-full">
        <CombinedChart token={token.symbol === "ETH" ? tokens["WETH"] : token} hours={168}/>
        </div>
    );
    }

export default TokenPage;
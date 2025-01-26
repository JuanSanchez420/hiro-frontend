'use client'

import { useMemo } from "react";
import usePortfolio from "../hooks/usePortfolio";
import tokensData from "../utils/tokens.json";
import { TokensData } from "../types";
import formatNumber from "../utils/formatNumber";
import TypingEffect from "../components/TypingEffect";
import { styles } from "../utils/styles";
import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";

const Portfolio = () => {
    const { balances } = usePortfolio();
    const tokens: TokensData = tokensData;

    const balancesWithTokens = useMemo(() => {
        if (!balances) return [];
        return balances.map((balance) => {
            return {
                token: tokens[balance.symbol],
                balance: balance.balance,
                usdPrice: balance.usdPrice,
            };
        });
    }, [balances, tokens]);

    return (
        <div className="flex flex-col h-full">
            <Breadcrumbs pages={[{ name: 'Portfolio', href: "/portfolio", current: true }]} />
            <div className="flex-1">
                <div className="mb-5">
                    <TypingEffect text="Here are your current holdings. Click one to see a chart and options for each token." speed={10} />
                </div>
                <div>
                    <a className="grid grid-cols-4 gap-2 p-2 text-gray-700 group rounded-md text-sm/6 font-semibold">
                        <div>ICON</div>
                        <div>SYMBOL</div>
                        <div>BALANCE</div>
                        <div>USD</div>
                    </a>
                </div>
                {balancesWithTokens.map((item) => {
                    return (
                        <div key={item.token.symbol}>
                            <Link className="grid grid-cols-4 gap-2 p-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 group rounded-md text-sm/6 font-semibold hover:cursor-pointer" href={`/token/${item.token.symbol}`}>
                                <div><img src={item.token.logoURI} height={30} width={30} alt={item.token.symbol} className="rounded-full" /></div>
                                <div>{item.token.symbol}</div>
                                <div>{formatNumber(item.balance)}</div>
                                <div>${formatNumber(Number(item.balance) * Number(item.usdPrice))}</div>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div>
                <div className="mx-auto w-fit">
                    <Link href="/"><button className={styles.button}>Back to Chat</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Portfolio;

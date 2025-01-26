'use client'

import Breadcrumbs from "../../components/Breadcrumbs";
import tokensData from "../../utils/tokens.json";
import { Token, TokensData } from "../../types";
import { useParams } from "next/navigation";

const TokenPage = () => {
    const { symbol } = useParams()
    const tokens: TokensData = tokensData;

    const token = tokens[symbol as string] as Token;

    const pages = [{ name: 'Portfolio', href: "/portfolio", current: false }, { name: token.name, href: "#", current: true }]

    return (
        <div className="w-full h-full">
            <Breadcrumbs pages={pages} />
        <h1>Token</h1>
        </div>
    );
    }

export default TokenPage;
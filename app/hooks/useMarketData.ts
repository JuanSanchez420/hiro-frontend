import { useCallback, useEffect, useRef, useState } from "react";
import tokensData from "../utils/tokens.json";
import { Token } from "../types";

interface Price {
    token: Token,
    usdPrice: string
}

export interface TokenHourData {
    token: string;
    periodStartUnix: number; // UNIX timestamp representing the hour
    open: number;
    close: number;
    high: number;
    low: number;
}

const useMarketData = () => {
    const didFetch = useRef(false);
    const [market, setMarket] = useState<Price[]>([]);
    const cbBTC = tokensData['CBBTC'];
    const WETH = tokensData['WETH'];

    const fetchMarket = useCallback(async () => {
        if (!cbBTC || !WETH) return;
        didFetch.current = true;
        try {
            const response = await fetch(`/api/prices?tokens=${[cbBTC.address, WETH.address].join(',')}&hours=1`, { credentials: 'include', });

            // for local testing, ignore the server
            if(response.status !== 200) return
            const data: { [token: string]: TokenHourData[] } = await response.json();

            setMarket([{ token: cbBTC, usdPrice: data[cbBTC.address.toLowerCase()][0].close.toString() || "0" }, { token: WETH, usdPrice: data[WETH.address.toLowerCase()][0].close.toString() || "0" }]);
        } catch (error) {
            console.error('[useMarketData] Error fetching market data:', error);
        }
    }, [cbBTC, WETH])

    useEffect(() => {
        if (cbBTC && WETH && !didFetch.current) fetchMarket();
    }, [cbBTC, WETH, fetchMarket]);

    return { market, fetchMarket };
}

export default useMarketData;
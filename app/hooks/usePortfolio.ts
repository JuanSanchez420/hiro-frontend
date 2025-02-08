import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Portfolio } from "../types";
import { useMessagesContext } from "../context/Context";

const usePortfolio = () => {
    const account = useAccount();
    const { hasSession } = useMessagesContext();
    const [portfolio, setPortfolio] = useState<Portfolio>();
    const [loading, setLoading] = useState(false);

    const fetchPortfolio = useCallback(async () => {
        if (!account?.isConnected || !hasSession) return;
        const response = await fetch(`/api/portfolio?account=${account.address}`);
        const data = await response.json();
        setPortfolio(data);
    }, [account, hasSession])

    useEffect(() => {
        const f = async () => {
            setLoading(true);
            const response = await fetch(`/api/portfolio?account=${account.address}`);
            const data = await response.json();
            setPortfolio(data);
            setLoading(false);
        }
        if (account?.isConnected && hasSession) f();
    }, [account, hasSession])

    return { portfolio, fetchPortfolio, loading };
}

export default usePortfolio;
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Portfolio } from "../types";

const usePortfolio = () => {
    const account = useAccount();
    const [portfolio, setPortfolio] = useState<Portfolio>();
    const [loading, setLoading] = useState(false);

    const fetchBalances = useCallback(async () => {
        if(!account?.isConnected) return;
        const response = await fetch(`/api/portfolio?account=${account.address}`);
        const data = await response.json();
        setPortfolio(data);
    }, [account])

    useEffect(() => {
        const f = async () => {
            setLoading(true);
            const response = await fetch(`/api/portfolio?account=${account.address}`);
            const data = await response.json();
            setPortfolio(data);
            setLoading(false);
        }
        if(account?.isConnected) f();
    }, [account])

    return { portfolio, fetchBalances, loading };
}

export default usePortfolio;
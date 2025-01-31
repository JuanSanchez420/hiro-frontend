import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface Balance {
    symbol: string,
    balance: string,
    usdPrice: string
}

const usePortfolio = () => {
    const account = useAccount();
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBalances = useCallback(async () => {
        if(!account?.isConnected) return;
        const response = await fetch(`/api/portfolio?account=${account.address}`);
        const data = await response.json();
        setBalances(data);
    }, [account])

    useEffect(() => {
        const f = async () => {
            setLoading(true);
            const response = await fetch(`/api/portfolio?account=${account.address}`);
            const data = await response.json();
            setBalances(data);
            setLoading(false);
        }
        if(account?.isConnected) f();
    }, [account])

    return { balances, fetchBalances, loading };
}

export default usePortfolio;
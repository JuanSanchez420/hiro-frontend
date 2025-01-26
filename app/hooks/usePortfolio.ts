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

    const fetchBalances = useCallback(async () => {
        const response = await fetch(`/api/portfolio?account=${account.address}`);
        const data = await response.json();
        setBalances(data);
    }, [account])

    useEffect(() => {
        const f = async () => {
            const response = await fetch(`/api/portfolio?account=${account.address}`);
            const data = await response.json();
            setBalances(data);
        }
        if(account) f();
    }, [account])

    return { balances, fetchBalances };
}

export default usePortfolio;
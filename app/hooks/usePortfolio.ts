import { useCallback, useEffect, useState } from "react";

interface Balance {
    symbol: string,
    value: string,
}

const usePortfolio = () => {
    const [balances, setBalances] = useState<Balance[]>([]);

    const fetchBalances = useCallback(async () => {
        const response = await fetch("/api/portfolio");
        const data = await response.json();
        setBalances(data);
    }, [])

    useEffect(() => {
        const f = async () => {
            const response = await fetch("/api/portfolio");
            const data = await response.json();
            setBalances(data);
        }
        f();
    }, [])

    return { balances, fetchBalances };
}

export default usePortfolio;
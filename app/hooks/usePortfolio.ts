import { useCallback, useEffect, useState } from "react";
import { Portfolio } from "../types";
import useHiro from "./useHiro";
import { NULL_ADDRESS } from "../utils/constants";

const usePortfolio = () => {
    const { hiro } = useHiro();
    const [portfolio, setPortfolio] = useState<Portfolio>();
    const [loading, setLoading] = useState(false);

    const fetchPortfolio = useCallback(async () => {
        if (hiro && hiro !== NULL_ADDRESS) return;
        const response = await fetch(`/api/portfolio?account=${hiro}`, { credentials: 'include', });
        const data = await response.json();
        setPortfolio({...data});
    }, [hiro])

    useEffect(() => {
        const f = async () => {
            setLoading(true);
            const response = await fetch(`/api/portfolio?account=${hiro}`, { credentials: 'include', });
            const data = await response.json();
            setPortfolio({...data});
            setLoading(false);
        }
        if (hiro && hiro !== NULL_ADDRESS) f();
    },[hiro])

    return { portfolio, fetchPortfolio, loading };
}

export default usePortfolio;
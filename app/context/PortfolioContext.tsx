'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Portfolio } from "../types";
import { NULL_ADDRESS } from "../utils/constants";
import { useAccount } from "wagmi";

const emptyPortfolio = { 
    address: NULL_ADDRESS as `0x${string}`, 
    hiro: NULL_ADDRESS as `0x${string}`, 
    balance: "0", 
    hiroBalance: "0", 
    tokens: [], 
    positions: [], 
    timestamp: Date.now()
}

interface PortfolioContextType {
    portfolio: Portfolio;
    loading: boolean;
    fetchPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const account = useAccount()
    const [portfolio, setPortfolio] = useState<Portfolio>(emptyPortfolio);
    const [loading, setLoading] = useState(false);

    const fetchPortfolio = useCallback(async () => {
        setLoading(true);
        const response = await fetch(`/api/portfolio`, { credentials: "include" });
        if(!response.ok) {
            setLoading(false);
            return;
        }
        const data = await response.json();
        setPortfolio({ ...data });
        setLoading(false);
    },[])

    useEffect(() => {
        if(portfolio.address === NULL_ADDRESS && account?.address !== NULL_ADDRESS && !loading) {
            fetchPortfolio();
        }
    }, [account?.address, portfolio, loading, fetchPortfolio]);



    return (
        <PortfolioContext.Provider value={{ portfolio, loading, fetchPortfolio }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolioContext = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolioContext must be used within a PortfolioProvider");
    }
    return context;
};
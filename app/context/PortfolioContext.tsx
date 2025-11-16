'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { Portfolio } from "../types";
import { NULL_ADDRESS } from "../utils/constants";
import { useAccount } from "wagmi";

const emptyPortfolio: Portfolio = {
    address: NULL_ADDRESS as `0x${string}`,
    hiro: NULL_ADDRESS as `0x${string}`,
    userWalletEthBalance: "0",
    tokens: [],
    positions: [],
    aave: [],
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
    const firstLoad = useRef(true);

    const fetchPortfolio = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/portfolio`, { credentials: "include" });
            if(!response.ok) {
                console.error('[PortfolioContext] Failed to fetch portfolio:', response.status, response.statusText);
                setLoading(false);
                return;
            }
            const data = await response.json();
            setPortfolio({ ...data });
        } catch (error) {
            console.error('[PortfolioContext] Error fetching portfolio:', error);
        } finally {
            setLoading(false);
        }
    },[])

    useEffect(() => {
        if(portfolio.address === NULL_ADDRESS && account?.address !== NULL_ADDRESS && firstLoad.current) {
            firstLoad.current = false;
            fetchPortfolio();
        }
    }, [account?.address, portfolio.address, fetchPortfolio]);



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

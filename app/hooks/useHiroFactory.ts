import { getContract, parseEther } from 'viem';
import HIRO_FACTORY_ABI from '../abi/HiroFactory.json';
import { useWalletClient } from 'wagmi';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import doConfettiBurst from '../utils/doConfettiBurst';
import { usePortfolioContext } from '../context/PortfolioContext';
import { NULL_ADDRESS } from '../utils/constants';

enum HiroWalletStatus {
    NOT_CREATED = 'NOT_CREATED',
    CREATING = 'CREATING',
    CREATED = 'CREATED'
}

const useHiroFactory = () => {
    const { data: client } = useWalletClient();
    const { fetchPortfolio, portfolio } = usePortfolioContext();
    const [status, setStatus] = useState<HiroWalletStatus>(HiroWalletStatus.NOT_CREATED);
    const depositAmount = 10000000000000000n; // 0.01 ETH

    const factory = useMemo(() => {
        if (!client) return null;
        return getContract({
            abi: HIRO_FACTORY_ABI,
            address: process.env.NEXT_PUBLIC_HIRO_FACTORY as `0x${string}`,
            client
        })
    }, [client])

    const signUp = useCallback(async (extraEth: string) => {
        if (!factory || !client) return null;
        setStatus(HiroWalletStatus.CREATING);

        try {
            const value = depositAmount + parseEther(extraEth).valueOf()

            const hash = await factory.write.createHiroWallet([], { value });

            await waitForTransactionReceipt(client, { hash });

            const response = await fetch('/api/update-wallet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: 'include',
                },
            })
            const data: { success: boolean; wallet: string } = await response.json();

            await fetchPortfolio();
            doConfettiBurst()
            setStatus(HiroWalletStatus.CREATED);

            return data.wallet;
        } catch (error) {
            setStatus(HiroWalletStatus.NOT_CREATED);
            console.error("Error creating HiroWallet:", error);
        }
    }, [factory, client, depositAmount, fetchPortfolio])

    // Keep local status in sync with portfolio.hiro if it already exists (e.g., page refresh after creation)
    useEffect(() => {
        if (!portfolio) return;
        if (portfolio.hiro && portfolio.hiro !== NULL_ADDRESS && status !== HiroWalletStatus.CREATED) {
            setStatus(HiroWalletStatus.CREATED);
        }
    }, [portfolio, status]);

    return { factory, status, signUp }
}

export default useHiroFactory;
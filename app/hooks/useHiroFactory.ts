import { getContract, parseEther } from 'viem';
import HIRO_FACTORY_ABI from '../abi/HiroFactory.json';
import { useAccount, useSimulateContract, useWalletClient } from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import { NULL_ADDRESS } from '../utils/constants';
import doConfettiBurst from '../utils/doConfettiBurst';
import { usePortfolioContext } from '../context/PortfolioContext';

enum HiroWalletStatus {
    NOT_CREATED = 'NOT_CREATED',
    CREATING = 'CREATING',
    CREATED = 'CREATED'
}

const useHiroFactory = () => {
    const account = useAccount();
    const [hiro, setHiro] = useState<`0x${string}` | null>(null);
    const { data: client } = useWalletClient();
    const { fetchPortfolio } = usePortfolioContext();
    const [status, setStatus] = useState<HiroWalletStatus>(HiroWalletStatus.NOT_CREATED);
    const depositAmount = 10000000000000000n; // 0.01 ETH
    const estimatedAmountOut = useSimulateContract({
        abi: HIRO_FACTORY_ABI,
        address: process.env.NEXT_PUBLIC_HIRO_FACTORY as `0x${string}`,
        functionName: 'swapETHForHiro',
        args: [0n, client?.account.address || NULL_ADDRESS],
        value: depositAmount
    });

    const factory = useMemo(() => {
        if (!client) return null;
        return getContract({
            abi: HIRO_FACTORY_ABI,
            address: process.env.NEXT_PUBLIC_HIRO_FACTORY as `0x${string}`,
            client
        })
    }, [client])

    const signUp = useCallback(async (extraEth: string) => {
        if (!factory || !client || !estimatedAmountOut?.data) return null;
        setStatus(HiroWalletStatus.CREATING);

        try {
            const raw = estimatedAmountOut.data.result as unknown as bigint
            const withSlippage = raw * 98n / 100n;
            
            const value = depositAmount + parseEther(extraEth).valueOf()

            const hash = await factory.write.createHiroWallet([withSlippage], { value });

            await waitForTransactionReceipt(client, { hash });

            const response = await fetch('/api/update-wallet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: 'include',
                },
            })
            const data: { success: boolean; wallet: string } = await response.json();
            setStatus(HiroWalletStatus.CREATED);
            setHiro(data.wallet as `0x${string}`);
            await fetchPortfolio();
            doConfettiBurst()

            return data.wallet;
        } catch (error) {
            setStatus(HiroWalletStatus.NOT_CREATED);
            console.error("Error creating HiroWallet:", error);
        }
    }, [factory, client, estimatedAmountOut, depositAmount])

    const getHiroWallet = useCallback(async (address: `0x${string}`) => {
        if (!factory || !client) return NULL_ADDRESS;

        const wallet: unknown = await factory.read.getWallet([address]);
        if (wallet && wallet !== NULL_ADDRESS) {
            setStatus(HiroWalletStatus.CREATED);
        }

        return wallet as `0x${string}` || NULL_ADDRESS;
    }, [factory, client])

    useEffect(() => {
        const f = async () => {
            if (!client || !account?.address) return;
            const hiro = await getHiroWallet(account.address);
            setHiro(hiro);
        }
        f()
    }, [client, account, getHiroWallet])

    return { factory, hiro, status, signUp, getHiroWallet }
}

export default useHiroFactory;
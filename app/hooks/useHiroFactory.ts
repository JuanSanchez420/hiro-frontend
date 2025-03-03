import { getContract, parseEther } from 'viem';
import HIRO_FACTORY_ABI from '../abi/HiroFactory.json';
import { useAccount, useSimulateContract, useWalletClient } from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import { NULL_ADDRESS } from '../utils/constants';

const useHiroFactory = () => {
    const account = useAccount();
    const [hiroAddress, setHiroAddress] = useState<`0x${string}` | null>(null);
    const { data: client } = useWalletClient();
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

    const signUp = useCallback(async () => {
        if (!factory || !client || !estimatedAmountOut?.data) return null;

        try {
            const raw = estimatedAmountOut.data.result as unknown as bigint
            const withSlippage = raw * 98n / 100n;

            const hash = await factory.write.createHiroWallet([withSlippage], { value: depositAmount + parseEther("2") });

            await waitForTransactionReceipt(client, { hash });

            const response = await fetch('/api/update-wallet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: 'include',
                },
            })
            const data: { success: boolean; wallet: string } = await response.json();
            return data.wallet;
        } catch (error) {
            console.error("Error creating HiroWallet:", error);
        }
    }, [factory, client, estimatedAmountOut, depositAmount])

    const getHiroWallet = useCallback(async (address: `0x${string}`) => {
        if (!factory || !client) return NULL_ADDRESS;

        const wallet: unknown = await factory.read.getWallet([address]);

        return wallet as `0x${string}` || NULL_ADDRESS;
    }, [factory, client])

    useEffect(() => {
        const f = async () => {
            if (!client || !account?.address) return;
            const hiroAddress = await getHiroWallet(account.address);
            setHiroAddress(hiroAddress);
        }
        f()
    }, [client, account, getHiroWallet])

    return { factory, hiroAddress, signUp, getHiroWallet }
}

export default useHiroFactory;
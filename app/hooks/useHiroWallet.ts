import { useEffect, useState } from 'react';
import { getContract } from 'viem';
import { sendTransaction, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useWalletClient } from 'wagmi';
import useHiroFactory from './useHiroFactory';
import HIRO_WALLET_ABI from '../abi/HiroWallet.json';
import { Token } from '../types';

const useHiroWallet = () => {
    const account = useAccount();
    const { data: client } = useWalletClient();
    const { getHiroWallet } = useHiroFactory();
    const [hiroAddress, setHiroAddress] = useState<`0x${string}` | null>(null);

    useEffect(() => {
        const f = async () => {
            if (!client || !account?.address) return;
            const hiroAddress = await getHiroWallet(account.address);
            setHiroAddress(hiroAddress);
        }
        f()
    }, [client, account, getHiroWallet])

    const deposit = async (token: Token, amount: bigint) => {
        if (!hiroAddress || !client) return null;
        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiroAddress,
                client
            })
            const hash = await hiroWallet.write.deposit([token.address, amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log(receipt);
        } catch (e) {
            console.error(e);
        }
    };

    const depositETH = async (amount: bigint) => {
        if (!client || !account.address) return null;
        const hash = await sendTransaction(client, {
            to: hiroAddress,
            value: amount,
            account: account?.address
        });

        const receipt = await waitForTransactionReceipt(client, { hash });

        return receipt;
    }

    const withdraw = async (token: Token, amount: bigint) => {
        if (!hiroAddress || !client) return null;
        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiroAddress,
                client
            })
            const hash = await hiroWallet.write.withdraw([token.address, amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log(receipt);
        } catch (e) {
            console.error(e);
        }
    }

    const withdrawETH = async (amount: bigint) => {
        if (!hiroAddress || !client) return null;
        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiroAddress,
                client
            })
            const hash = await hiroWallet.write.withdrawETH([amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log(receipt);
        } catch (e) {
            console.error(e);
        }
    }

    return { hiroAddress, deposit, depositETH, withdraw, withdrawETH };
};

export default useHiroWallet;
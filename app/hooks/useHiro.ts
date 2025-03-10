import { useEffect, useState } from 'react';
import { erc20Abi, getContract } from 'viem';
import { sendTransaction, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useWalletClient } from 'wagmi';
import useHiroFactory from './useHiroFactory';
import HIRO_WALLET_ABI from '../abi/HiroWallet.json';
import { Token } from '../types';
import { NULL_ADDRESS } from '../utils/constants';

const useHiro = () => {
    const account = useAccount();
    const { data: client } = useWalletClient();
    const { getHiroWallet } = useHiroFactory();
    const [hiro, setHiro] = useState<`0x${string}` | null>(null);

    useEffect(() => {
        const f = async () => {
            if (!client || !account?.address) return;
            const hiro = await getHiroWallet(account.address);
            setHiro(hiro);
        }
        f()
    }, [client, account, getHiroWallet])

    const deposit = async (token: Token, amount: bigint) => {
        if (!hiro || hiro === NULL_ADDRESS || !client) return null;
        try {
            const erc20 = getContract({
                abi: erc20Abi,
                address: token.address as `0x${string}`,
                client
            })
            const hash = await erc20.write.transfer([hiro, amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log(receipt);
        } catch (e) {
            console.error(e);
        }
    };

    const depositETH = async (amount: bigint) => {
        if (!client || !account.address) return null;
        const hash = await sendTransaction(client, {
            to: hiro,
            value: amount,
            account: account?.address
        });

        const receipt = await waitForTransactionReceipt(client, { hash });

        return receipt;
    }

    const withdraw = async (token: Token, amount: bigint) => {
        if (!hiro || !client) return null;
        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiro,
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
        if (!hiro || !client) return null;
        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiro,
                client
            })
            const hash = await hiroWallet.write.withdrawETH([amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log(receipt);
        } catch (e) {
            console.error(e);
        }
    }

    return { hiro, deposit, depositETH, withdraw, withdrawETH };
};

export default useHiro;
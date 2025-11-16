import { useEffect, useState } from 'react';
import { erc20Abi, getContract } from 'viem';
import { sendTransaction, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useWalletClient } from 'wagmi';
import HIRO_WALLET_ABI from '../abi/HiroWallet.json';
import { Token } from '../types';
import { NULL_ADDRESS } from '../utils/constants';
import { usePortfolioContext } from '../context/PortfolioContext';

const useHiro = () => {
    const account = useAccount();
    const { data: client } = useWalletClient();
    const [hiro, setHiro] = useState<`0x${string}` | null>(null);
    const {portfolio} = usePortfolioContext();

    useEffect(()=>{
        setHiro(portfolio?.hiro)
    },[portfolio])

    const deposit = async (token: Token, amount: bigint) => {
        if (!hiro || hiro === NULL_ADDRESS || !client) {
            console.error('[deposit] Missing hiro or client, or hiro is NULL_ADDRESS', { hiro, hasClient: !!client });
            return null;
        }

        try {
            const erc20 = getContract({
                abi: erc20Abi,
                address: token.address as `0x${string}`,
                client
            })

            const hash = await erc20.write.transfer([hiro, amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });

            return receipt;
        } catch (e) {
            console.error('[deposit] Error occurred:', e);
            throw e;
        }
    };

    const depositETH = async (amount: bigint) => {
        if (!client || !account.address) {
            console.error('[depositETH] Missing client or account address', { hasClient: !!client, hasAccount: !!account.address });
            return null;
        }

        try {
            const hash = await sendTransaction(client, {
                to: hiro,
                value: amount,
                account: account?.address
            });

            const receipt = await waitForTransactionReceipt(client, { hash });

            return receipt;
        } catch (e) {
            console.error('[depositETH] Error occurred:', e);
            throw e;
        }
    }

    const withdraw = async (token: Token, amount: bigint) => {
        if (!hiro || !client) {
            console.error('[withdraw] Missing hiro or client', { hiro, hasClient: !!client });
            return null;
        }

        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiro,
                client
            })

            const hash = await hiroWallet.write.withdraw([token.address, amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });

            return receipt;
        } catch (e) {
            console.error('[withdraw] Error occurred:', e);
            throw e;
        }
    }

    const withdrawETH = async (amount: bigint) => {
        if (!hiro || !client) {
            console.error('[withdrawETH] Missing hiro or client', { hiro, hasClient: !!client });
            return null;
        }

        try {
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiro,
                client
            })

            const hash = await hiroWallet.write.withdrawETH([amount]);
            const receipt = await waitForTransactionReceipt(client, { hash });

            return receipt;
        } catch (e) {
            console.error('[withdrawETH] Error occurred:', e);
            throw e;
        }
    }

    return { hiro, deposit, depositETH, withdraw, withdrawETH };
};

export default useHiro;
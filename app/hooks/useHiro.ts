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
        console.log('[deposit] Starting ERC20 deposit', { token: token.symbol, tokenAddress: token.address, amount: amount.toString(), hiro, hasClient: !!client });

        if (!hiro || hiro === NULL_ADDRESS || !client) {
            console.error('[deposit] Missing hiro or client, or hiro is NULL_ADDRESS', { hiro, hasClient: !!client });
            return null;
        }

        try {
            console.log('[deposit] Creating ERC20 contract instance');
            const erc20 = getContract({
                abi: erc20Abi,
                address: token.address as `0x${string}`,
                client
            })

            console.log('[deposit] Calling transfer on ERC20 contract', { to: hiro, amount: amount.toString() });
            const hash = await erc20.write.transfer([hiro, amount]);
            console.log('[deposit] Transaction sent', { hash });

            console.log('[deposit] Waiting for transaction receipt');
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log('[deposit] Transaction confirmed', receipt);

            return receipt;
        } catch (e) {
            console.error('[deposit] Error occurred:', e);
            throw e;
        }
    };

    const depositETH = async (amount: bigint) => {
        console.log('[depositETH] Starting ETH deposit', { amount: amount.toString(), hiro, hasClient: !!client, hasAccount: !!account.address });

        if (!client || !account.address) {
            console.error('[depositETH] Missing client or account address', { hasClient: !!client, hasAccount: !!account.address });
            return null;
        }

        try {
            console.log('[depositETH] Sending ETH transaction', { to: hiro, value: amount.toString(), from: account.address });
            const hash = await sendTransaction(client, {
                to: hiro,
                value: amount,
                account: account?.address
            });
            console.log('[depositETH] Transaction sent', { hash });

            console.log('[depositETH] Waiting for transaction receipt');
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log('[depositETH] Transaction confirmed', receipt);

            return receipt;
        } catch (e) {
            console.error('[depositETH] Error occurred:', e);
            throw e;
        }
    }

    const withdraw = async (token: Token, amount: bigint) => {
        console.log('[withdraw] Starting ERC20 withdrawal', { token: token.symbol, tokenAddress: token.address, amount: amount.toString(), hiro, hasClient: !!client });

        if (!hiro || !client) {
            console.error('[withdraw] Missing hiro or client', { hiro, hasClient: !!client });
            return null;
        }

        try {
            console.log('[withdraw] Creating hiroWallet contract instance');
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiro,
                client
            })

            console.log('[withdraw] Calling withdraw on contract', { tokenAddress: token.address, amount: amount.toString() });
            const hash = await hiroWallet.write.withdraw([token.address, amount]);
            console.log('[withdraw] Transaction sent', { hash });

            console.log('[withdraw] Waiting for transaction receipt');
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log('[withdraw] Transaction confirmed', receipt);

            return receipt;
        } catch (e) {
            console.error('[withdraw] Error occurred:', e);
            throw e;
        }
    }

    const withdrawETH = async (amount: bigint) => {
        console.log('[withdrawETH] Starting withdrawal', { amount: amount.toString(), hiro, hasClient: !!client });

        if (!hiro || !client) {
            console.error('[withdrawETH] Missing hiro or client', { hiro, hasClient: !!client });
            return null;
        }

        try {
            console.log('[withdrawETH] Creating hiroWallet contract instance');
            const hiroWallet = getContract({
                abi: HIRO_WALLET_ABI,
                address: hiro,
                client
            })

            console.log('[withdrawETH] Calling withdrawETH on contract', { amount: amount.toString() });
            const hash = await hiroWallet.write.withdrawETH([amount]);
            console.log('[withdrawETH] Transaction sent', { hash });

            console.log('[withdrawETH] Waiting for transaction receipt');
            const receipt = await waitForTransactionReceipt(client, { hash });
            console.log('[withdrawETH] Transaction confirmed', receipt);

            return receipt;
        } catch (e) {
            console.error('[withdrawETH] Error occurred:', e);
            throw e;
        }
    }

    return { hiro, deposit, depositETH, withdraw, withdrawETH };
};

export default useHiro;
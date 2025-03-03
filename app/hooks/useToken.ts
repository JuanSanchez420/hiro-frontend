import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import ERC20 from "../abi/ERC20.json";
import { useCallback } from "react";

const useToken = (address: `0x${string}`) => {
    const account = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const allowance = useCallback(
        async (owner: string, spender: string) => {
            if (!publicClient) throw new Error("Public client not available");
            return await publicClient.readContract({
                address,
                abi: ERC20,
                functionName: "allowance",
                args: [owner, spender],
            });
        },
        [publicClient, address]
    );

    const approve = useCallback(
        async (spender: string, amount: bigint) => {
            if (!account?.address) throw new Error("No connected account");
            if (!walletClient) throw new Error("Wallet client not available");
            
            console.log("Approving", account.address, spender, amount);
            return await walletClient.writeContract({
                address,
                abi: ERC20,
                functionName: "approve",
                args: [spender, amount],
            });
        },
        [walletClient, account, address]
    );

    const balanceOf = useCallback(
        async (userAddress?: string) => {
            if (!publicClient) throw new Error("Public client not available");

            const addr = userAddress || account?.address;
            if (!addr) throw new Error("No address provided");
            return await publicClient.readContract({
                address,
                abi: ERC20,
                functionName: "balanceOf",
                args: [addr],
            });
        },
        [publicClient, account, address]
    );

    const transfer = useCallback(
        async (to: string, amount: bigint) => {
            if (!account?.address) throw new Error("No connected account");
            if (!walletClient) throw new Error("Wallet client not available");

            return await walletClient.writeContract({
                address,
                abi: ERC20,
                functionName: "transfer",
                args: [to, amount],
            });
        },
        [walletClient, account, address]
    );

    const transferFrom = useCallback(
        async (from: string, to: string, amount: bigint) => {
            if (!walletClient) throw new Error("Wallet client not available");
            return await walletClient.writeContract({
                address,
                abi: ERC20,
                functionName: "transferFrom",
                args: [from, to, amount],
            });
        },
        [walletClient, address]
    );

    return {
        allowance,
        approve,
        balanceOf,
        transfer,
        transferFrom,
    };
}

export default useToken;
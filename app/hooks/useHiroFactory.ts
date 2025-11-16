import { getContract, parseEther } from 'viem';
import HIRO_FACTORY_ABI from '../abi/HiroFactory.json';
import { useWalletClient } from 'wagmi';
import { useCallback, useMemo, useState } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import doConfettiBurst from '../utils/doConfettiBurst';
import { usePortfolioContext } from '../context/PortfolioContext';
import { NULL_ADDRESS } from '../utils/constants';
import { useMessagesContext } from '../context/MessagesContext';
import { usePromptsContext } from '../context/PromptsContext';

enum HiroWalletStatus {
    NOT_CREATED = 'NOT_CREATED',
    CREATING = 'CREATING',
    CREATED = 'CREATED'
}

// Shared creating state to track if a creation is in progress
let isCreating = false;

const useHiroFactory = () => {
    const { data: client } = useWalletClient();
    const { fetchPortfolio, portfolio } = usePortfolioContext();
    const { addMessage } = useMessagesContext();
    const { addPrompt } = usePromptsContext();
    const [creatingState, setCreatingState] = useState(false);

    // Derive status from portfolio data
    const status = useMemo(() => {
        if (creatingState || isCreating) {
            return HiroWalletStatus.CREATING;
        }

        if (portfolio?.hiro && portfolio.hiro !== NULL_ADDRESS) {
            return HiroWalletStatus.CREATED;
        }

        return HiroWalletStatus.NOT_CREATED;
    }, [portfolio?.hiro, creatingState]);

    const factory = useMemo(() => {
        if (!client) return null;
        return getContract({
            abi: HIRO_FACTORY_ABI,
            address: process.env.NEXT_PUBLIC_HIRO_FACTORY as `0x${string}`,
            client
        })
    }, [client])

    const signUp = useCallback(async (extraEth: string) => {
        if (!factory || !client) {
            console.error('[useHiroFactory] Missing dependencies:', {
                hasFactory: !!factory,
                hasClient: !!client
            });
            return null;
        }

        setCreatingState(true);
        isCreating = true;

        try {
            const value = parseEther(extraEth).valueOf()
            const hash = await factory.write.createHiroWallet([], { value });
            await waitForTransactionReceipt(client, { hash });

            const response = await fetch('/api/update-wallet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[useHiroFactory] API error response:', errorText);
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const data: { success: boolean; wallet: string } = await response.json();

            try {
                await fetchPortfolio();
            } catch (portfolioError) {
                console.error('[useHiroFactory] Portfolio fetch failed:', portfolioError);
                // Continue anyway - portfolio will be fetched on next render
            }

            doConfettiBurst()

            setCreatingState(false);
            isCreating = false;

            const prompt = 'I created a Hiro. What can you do?';
            addMessage({
                id: Date.now(),
                message: prompt,
                type: 'user',
                completed: true,
            });
            addPrompt(prompt);

            return data.wallet;
        } catch (error) {
            setCreatingState(false);
            isCreating = false;
            console.error('[useHiroFactory] Error creating HiroWallet:', error);
            console.error('[useHiroFactory] Error details:', {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                error
            });
        }
    }, [factory, client, fetchPortfolio, addMessage, addPrompt])

    return { factory, status, signUp }
}

export default useHiroFactory;

import { useState, useCallback } from 'react';

// ["Swap", "Add/Remove Liquidity", "Portfolio", "Menu", "Connect Wallet", "Autonoumous Instructions", "Message Box"]

export function useHighlight() {
    const [highlight, setHighlight] = useState<string | undefined>();

    const triggerHighlight = useCallback((section: string) => {
        console.log(`highlight-${section.toLowerCase().replace(" ", "")}`);
        setHighlight(`highlight-${section.toLowerCase().replace(" ", "")}`);
        setTimeout(() => setHighlight(undefined), 10_000);
    }, []);

    return { highlight, triggerHighlight };
}
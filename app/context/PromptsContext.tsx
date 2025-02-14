'use client'
import { createContext, useContext, useState } from "react";

export interface Message {
    message: string
    type: "user" | "assistant" | "function"
    functionCall?: Record<string, unknown>
    completed: boolean
}

interface PromptsContextType {
    prompts: string[]
    addPrompt: (prompt: string) => void
    resetPrompts: () => void
}

export const PromptsContext = createContext<PromptsContextType | undefined>(undefined);

export const PromptsProvider = ({ children }: { children: React.ReactNode }) => {
    const [prompts, setPrompts] = useState<string[]>([]);

    const addPrompt = (prompt: string) => {
        setPrompts(prev => [...prev, prompt]);
    }

    const resetPrompts = () => {
        setPrompts([]);
    }

    return (
        <PromptsContext.Provider value={{
            prompts, addPrompt, resetPrompts,
        }}>
            {children}
        </PromptsContext.Provider>
    );
};

export const usePromptsContext = () => {
    const context = useContext(PromptsContext);
    if (context === undefined) {
        throw new Error('usePromptsContext must be used within a PromptsProvider');
    }
    return context;
}

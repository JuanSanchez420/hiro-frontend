'use client'
import { createContext, useContext, useMemo, useState } from "react";

export interface Message {
    message: string
    type: "user" | "assistant" | "function"
    functionCall?: Record<string, unknown>
}

interface MessagesContextType {
    messages: Message[]
    addMessage: (message: string, type: "assistant" | "user" | "function", completed: boolean, functionCall?: Record<string, unknown>) => void
    resetMessages: () => void
    thinking: boolean
    setThinking: React.Dispatch<React.SetStateAction<boolean>>
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [thinking, setThinking] = useState(false);

    const addMessage = (message: string, type: "assistant" | "user" | "function", completed: boolean, functionCall?: Record<string, unknown>) => {
        setThinking(true);
        setMessages(prev => [...prev, { message, type, completed, functionCall }]);
    }

    const messagesMemo = useMemo(() => messages, [messages]);

    const resetMessages = () => {
        setMessages([]);
    }

    return (
        <MessagesContext.Provider value={{
            messages: messagesMemo, addMessage, resetMessages,
            thinking, setThinking,
        }}>
            {children}
        </MessagesContext.Provider>
    );
};

export const useMessagesContext = () => {
    const context = useContext(MessagesContext);
    if (context === undefined) {
        throw new Error('useMessagesContext must be used within a MessagesProvider');
    }
    return context;
}

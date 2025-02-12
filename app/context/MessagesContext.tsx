'use client'
import { createContext, useContext, useState } from "react";

export interface Message {
    message: string
    type: "user" | "assistant" | "function"
    completed: boolean
    functionCall?: Record<string, unknown>
}

interface MessagesContextType {
    messages: Message[]
    addMessage: (message: string, type: "assistant" | "user" | "function", completed: boolean, functionCall?: Record<string, unknown>) => void
    addChunk: (chunk: string, status: "start" | "middle" | "end") => void
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

    const addChunk = (chunk: string, status: "start" | "middle" | "end") => {
        if (status === "start") {
            setMessages(prev => [...prev, { message: chunk, type: "assistant", completed: false }]);
        }
        if (status === "middle") {
            setMessages((prev) => {
                const incomplete = prev.filter((m) => !m.completed)

                return [...prev.filter(m => m.completed), { message: incomplete[0].message + chunk, type: "assistant", completed: false }]
            })
        }
        if (status === "end") {
            setMessages((prev) => {
                const incomplete = prev.filter((m) => !m.completed)

                return [...prev.filter(m => m.completed), { message: incomplete[0].message + chunk, type: "assistant", completed: true }]
            })
            setThinking(false)
        }
    }

    const resetMessages = () => {
        setMessages([]);
    }

    return (
        <MessagesContext.Provider value={{
            messages, addMessage, resetMessages,
            addChunk,
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

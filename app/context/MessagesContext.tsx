'use client'

import { createContext, useContext, useState, useCallback } from "react";
import { Message } from "../types";

interface MessagesContextType {
    messages: Message[]
    loading: boolean
    addMessage: (message: Message) => void
    updateMessage: (index: number, updates: Partial<Message>) => void
    loadMessages: () => Promise<void>
    resetMessages: () => void
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const addMessage = useCallback((message: Message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const updateMessage = useCallback((index: number, updates: Partial<Message>) => {
        setMessages(prev => 
            prev.map((msg, i) => i === index ? { ...msg, ...updates } : msg)
        );
    }, []);

    const loadMessages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/messages');
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.messages)) {
                    // Transform API format {role, content} to our Message interface {type, message}
                    const transformedMessages: Message[] = data.messages.map((msg: any) => ({
                        message: msg.content,
                        type: msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'assistant' : 'function',
                        completed: true,
                        functionCall: msg.functionCall
                    }));
                    setMessages(transformedMessages);
                } else if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error('API returned unexpected data format:', data);
                    setMessages([]);
                }
            } else {
                console.error('Failed to load messages:', response.statusText);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const resetMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return (
        <MessagesContext.Provider value={{
            messages,
            loading,
            addMessage,
            updateMessage,
            loadMessages,
            resetMessages,
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
};
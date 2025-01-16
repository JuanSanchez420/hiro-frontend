'use client'
import { createContext, useContext, useState } from "react";
import { WidgetOption, widgetOptions } from "../components/widgets/widgetOptions";

export interface Message {
    message: string
    type: "user" | "assistant" | "function"
    completed: boolean
}

interface MessagesContextType {
    messages: Message[]
    addMessage: (message: string, type: "assistant" | "user" | "function", completed: boolean) => void
    addChunk: (chunk: string, status: "start" | "middle" | "end") => void
    drawerOpen: boolean
    setDrawerOpen: (open: boolean) => void
    widget: WidgetOption
    setWidget: (widgetOption: WidgetOption) => void
    session: string
    setSession: (session: string) => void
    thinking: boolean
    setThinking: (thinking: boolean) => void
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [widget, setWidget] = useState<WidgetOption>(widgetOptions[4]);
    const [session, setSession] = useState("");
    const [thinking, setThinking] = useState(false);

    const addMessage = (message: string, type: "assistant" | "user" | "function", completed: boolean) => {
        setThinking(true);
        setMessages(prev=> [...prev, { message, type, completed }]);
    }

    const addChunk = (chunk: string, status: "start" | "middle" | "end") => {
        if (status === "start") {
            setMessages(prev=> [...prev, { message: chunk, type: "assistant", completed: false }]);
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

    return (
        <MessagesContext.Provider value={{ 
            messages, addMessage, 
            addChunk, 
            drawerOpen, setDrawerOpen, 
            widget, setWidget, 
            session, setSession,
            thinking, setThinking
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

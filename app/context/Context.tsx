'use client'
import { createContext, useContext, useState } from "react";
import { WidgetOption, widgetOptions } from "../components/widgets/widgetOptions";

export interface Message {
    message: string
    type: "user" | "system"
    completed: boolean
}

interface MessagesContextType {
    messages: Message[]
    addMessage: (message: string, type: "system" | "user", completed: boolean) => void
    addChunk: (chunk: string, status: "start" | "middle" | "end") => void
    drawerOpen: boolean
    setDrawerOpen: (open: boolean) => void
    widget: WidgetOption
    setWidget: (widgetOption: WidgetOption) => void
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [widget, setWidget] = useState<WidgetOption>(widgetOptions[4]);

    const addMessage = (message: string, type: "system" | "user", completed: boolean) => {
        setMessages([...messages, { message, type, completed }]);
    }

    const addChunk = (chunk: string, status: "start" | "middle" | "end") => {
        if (status === "start") {
            setMessages([...messages, { message: chunk, type: "system", completed: false }]);
        }
        if (status === "middle") {
            setMessages((prev) => [...prev.slice(0, prev.length - 1), { message: prev[prev.length - 1].message + chunk, type: "system", completed: false }]);
        }
        if (status === "end") {
            setMessages((prev) => [...prev.slice(0, prev.length - 1), { message: prev[prev.length - 1].message + chunk, type: "system", completed: true }]);
        }
    }

    return (
        <MessagesContext.Provider value={{ messages, addMessage, addChunk, drawerOpen, setDrawerOpen, widget, setWidget }}>
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

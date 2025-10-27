'use client'

import { createContext, useContext, useMemo, useState } from "react"
import { WidgetOption } from "../types"
import { getStyles } from "../utils/styles"

interface GlobalContextType {
    drawerLeftOpen: boolean
    setDrawerLeftOpen: React.Dispatch<React.SetStateAction<boolean>>
    showRecommendations: boolean
    setShowRecommendations: React.Dispatch<React.SetStateAction<boolean>>
    widget: WidgetOption
    setWidget: React.Dispatch<React.SetStateAction<WidgetOption>>
    widgetData: Record<string, unknown> | null
    setWidgetData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>
    isSignedIn: boolean
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
    theme: "light" | "dark"
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    styles: ReturnType<typeof getStyles>
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [widget, setWidget] = useState<WidgetOption>(null);
    const [widgetData, setWidgetData] = useState<Record<string, unknown> | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const styles = useMemo(() => getStyles(theme), [theme]);

    const value = useMemo(() => ({
        theme, setTheme, styles,
        drawerLeftOpen, setDrawerLeftOpen,
        showRecommendations, setShowRecommendations,
        widget, setWidget,
        widgetData, setWidgetData,
        isSignedIn, setIsSignedIn,
    }), [theme, styles, drawerLeftOpen, showRecommendations, widget, widgetData, isSignedIn]);

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalContextProvider');
    }
    return context;
}
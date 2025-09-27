'use client'

import { createContext, useContext, useState } from "react"
import { WidgetOption } from "../types"
import { getStyles } from "../utils/styles"

interface GlobalContextType {
    drawerLeftOpen: boolean
    setDrawerLeftOpen: React.Dispatch<React.SetStateAction<boolean>>
    widget: WidgetOption
    setWidget: React.Dispatch<React.SetStateAction<WidgetOption>>
    isSignedIn: boolean
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
    theme: "light" | "dark"
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    styles: ReturnType<typeof getStyles>
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
    const [widget, setWidget] = useState<WidgetOption>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const styles = getStyles(theme)

    return (
        <GlobalContext.Provider value={{
            theme, setTheme, styles,
            drawerLeftOpen, setDrawerLeftOpen,
            widget, setWidget,
            isSignedIn, setIsSignedIn,
        }}>
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
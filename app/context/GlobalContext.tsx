'use client'

import { createContext, useContext, useState } from "react"
import { WidgetOption } from "../types"
import { getStyles } from "../utils/styles"

interface GlobalContextType {
    drawerLeftOpen: boolean
    setDrawerLeftOpen: React.Dispatch<React.SetStateAction<boolean>>
    drawerRightOpen: boolean
    setDrawerRightOpen: React.Dispatch<React.SetStateAction<boolean>>
    widget: WidgetOption
    setWidget: React.Dispatch<React.SetStateAction<WidgetOption>>
    showConfirm: boolean
    setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
    isSignedIn: boolean
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
    rain: string | undefined
    setRain: React.Dispatch<React.SetStateAction<string | undefined>>
    theme: "light" | "dark"
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    styles: ReturnType<typeof getStyles> 
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
    const [drawerRightOpen, setDrawerRightOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [widget, setWidget] = useState<WidgetOption>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [rain, setRain] = useState<string | undefined>();
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const styles = getStyles(theme)

    return (
        <GlobalContext.Provider value={{
            theme, setTheme, styles,
            drawerLeftOpen, setDrawerLeftOpen,
            drawerRightOpen, setDrawerRightOpen,
            widget, setWidget,
            showConfirm, setShowConfirm,
            isSignedIn, setIsSignedIn,
            rain, setRain
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
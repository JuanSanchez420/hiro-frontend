'use client'

import React, { createContext, useContext, useMemo, useState, useCallback } from "react"
import { WidgetOption } from "../types"
import { getStyles } from "../utils/styles"

interface ThemeContextType {
    theme: "light" | "dark"
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    styles: ReturnType<typeof getStyles>
}

interface DrawerState {
    isOpen: boolean
    showRecommendations: boolean
}

interface DrawerContextType {
    drawerState: DrawerState
    setDrawerState: React.Dispatch<React.SetStateAction<DrawerState>>
}

interface WidgetContextType {
    widget: WidgetOption
    setWidget: React.Dispatch<React.SetStateAction<WidgetOption>>
    widgetData: Record<string, unknown> | null
    setWidgetData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>
}

interface AuthContextType {
    isSignedIn: boolean
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
const WidgetContext = createContext<WidgetContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [drawerState, setDrawerStateRaw] = useState<DrawerState>({ isOpen: false, showRecommendations: false });
    const [widget, setWidget] = useState<WidgetOption>(null);
    const [widgetData, setWidgetData] = useState<Record<string, unknown> | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);

    const setDrawerState = useCallback((value: DrawerState | ((prev: DrawerState) => DrawerState)) => {
        setDrawerStateRaw(value);
    }, []);

    const styles = useMemo(() => getStyles(theme), [theme]);

    const themeValue = useMemo(() => ({
        theme,
        setTheme,
        styles,
    }), [theme, styles]);

    const drawerValue = useMemo(() => ({
        drawerState,
        setDrawerState,
    }), [drawerState, setDrawerState]);

    const widgetValue = useMemo(() => ({
        widget,
        setWidget,
        widgetData,
        setWidgetData,
    }), [widget, widgetData]);

    const authValue = useMemo(() => ({
        isSignedIn,
        setIsSignedIn,
    }), [isSignedIn]);

    return (
        <ThemeContext.Provider value={themeValue}>
            <DrawerContext.Provider value={drawerValue}>
                <WidgetContext.Provider value={widgetValue}>
                    <AuthContext.Provider value={authValue}>
                        {children}
                    </AuthContext.Provider>
                </WidgetContext.Provider>
            </DrawerContext.Provider>
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a GlobalContextProvider');
    }
    return context;
}

export const useDrawerContext = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawerContext must be used within a GlobalContextProvider');
    }
    return context;
}

export const useWidgetContext = () => {
    const context = useContext(WidgetContext);
    if (!context) {
        throw new Error('useWidgetContext must be used within a GlobalContextProvider');
    }
    return context;
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a GlobalContextProvider');
    }
    return context;
}

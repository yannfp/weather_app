import React, { createContext, useContext, useState } from "react";
import { WeatherTheme } from "../types";

type ThemeContextType = {
    theme: WeatherTheme;
    setTheme: (theme: WeatherTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // set the application theme to default on first launch
    const [theme, setTheme] = useState<WeatherTheme>("default");

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = (): ThemeContextType => {

    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
};
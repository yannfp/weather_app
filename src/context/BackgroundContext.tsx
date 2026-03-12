import React, { createContext, useContext, useState } from "react";
import { getBackgroundImage } from "../utils/weatherHelpers";

type BackgroundContextType = {
    backgroundImage: string;
    isNight: boolean;
    setBackground: (image: string, night: boolean) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [backgroundImage, setBackgroundImage] = useState(getBackgroundImage("default"));
    const [isNight, setIsNight] = useState(false);

    const setBackground = (image: string, night: boolean) => {
        setBackgroundImage(image);
        setIsNight(night);
    };

    return (
        <BackgroundContext.Provider value={{ backgroundImage, isNight, setBackground }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context) throw new Error("useBackground must be used within BackgroundProvider");
    return context;
};
import React, { createContext, useContext, useEffect, useState } from "react";

import {getSettings, TemperatureUnit, updateTemperatureUnit} from "../services/settingsService";

type SettingsContextType = {
    unit: TemperatureUnit;
    setUnit: (unit: TemperatureUnit) => Promise<void>;
    loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {

    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within SettingsContext");
    }

    return context;
};

export const SettingsProvider:React.FC<{ children : React.ReactNode }> = ({ children }) => {

    const [unit, setUnitState] = useState<TemperatureUnit>("celsius");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const load = async () => {
            try {
                const saved = await getSettings();
                setUnitState(saved);
            } catch {}

            setLoading(false);
        };

        load();
    }, []);

    const setUnit = async (newUnit: TemperatureUnit) => {
        setUnitState(newUnit);
        await updateTemperatureUnit(newUnit);
    };

    return (
      <SettingsContext.Provider value={{ unit, setUnit, loading }}>
          { children }
      </SettingsContext.Provider>
    );
}
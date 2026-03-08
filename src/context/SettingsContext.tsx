import React, { createContext, useContext, useEffect, useState } from "react";

import {
    getSettings,
    TemperatureUnit,
    TimeFormat,
    updateTemperatureUnit,
    updateTimeFormat
} from "../services/settingsService";

type SettingsContextType = {
    unit: TemperatureUnit;
    setUnit: (unit: TemperatureUnit) => Promise<void>;

    timeFormat: TimeFormat;
    setTimeFormat: (timeFormat: TimeFormat) => Promise<void>;

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
    const [timeFormat, setTimeFormatState] = useState<TimeFormat>("12h");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const load = async () => {
            try {
                const saved = await getSettings();
                setUnitState(saved.unit);
                setTimeFormatState(saved.timeFormat);
            } catch {}

            setLoading(false);
        };

        load();
    }, []);

    const setUnit = async (newUnit: TemperatureUnit) => {
        setUnitState(newUnit);
        await updateTemperatureUnit(newUnit);
    };

    const setTimeFormat = async (format: TimeFormat) => {
        setTimeFormatState(format);
        await updateTimeFormat(format);
    };

    return (
      <SettingsContext.Provider value={{ unit, setUnit, timeFormat, setTimeFormat, loading }}>
          { children }
      </SettingsContext.Provider>
    );
}
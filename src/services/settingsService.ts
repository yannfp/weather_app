import { supabase } from "../lib/supabase";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type TimeFormat = "12h" | "24h";

// get the user settings from database
export const getSettings = async (): Promise<{ unit: TemperatureUnit; timeFormat: TimeFormat }> => {

    const { data, error } = await supabase
        .from("user_settings")
        .select("temperature_unit, time_format")
        .single();

    if (error || !data) {
        return { unit: "celsius", timeFormat: "12h"};
    }

    return { unit: data.temperature_unit as TemperatureUnit, timeFormat: data.time_format as TimeFormat };
}

// update the user's desired unit
export const updateTemperatureUnit = async (unit: TemperatureUnit): Promise<void> => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return ;
    }

    const { error } = await supabase
        .from("user_settings")
        .upsert(
            { user_id: user.id, temperature_unit: unit, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
        );

    if (error) {
        throw new Error(error.message);
    }}

// update time format
export const updateTimeFormat = async (format: TimeFormat): Promise<void> => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return;
    }

    const { error } = await supabase
        .from("user_settings")
        .upsert(
            { user_id: user.id, time_format: format, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
        );

    if (error) {
        throw new Error(error.message);
    }
}
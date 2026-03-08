import { supabase } from "../lib/supabase";

export type TemperatureUnit = "celsius" | "fahrenheit";

// get the user settings from database
export const getSettings = async (): Promise<TemperatureUnit> => {

    const { data, error } = await supabase
        .from("user_settings")
        .select("temperature_unit")
        .single();

    if (error || !data) {
        return "celsius";
    }

    return data.temperature_unit as TemperatureUnit;
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
        )
}
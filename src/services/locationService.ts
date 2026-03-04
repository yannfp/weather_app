import { supabase } from "../lib/supabase";
import { SavedLocation, NewLocation } from "../types";

// get all saved location for the logged-in user
export async function getSavedLocations(): Promise<SavedLocation[]> {

    // create an SQL query to our database to get all locations that have been saved by the user
    const { data, error } = await supabase
        .from("saved_locations")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return data || [];
}

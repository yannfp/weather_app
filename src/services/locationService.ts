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

// add a new location for the logged-in user
export async function addLocation(location: NewLocation): Promise<SavedLocation> {

    // retrieve the user that wants to add a new location
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be logged in to save a new location.");

    const { data, error } = await supabase
        .from("saved_locations")
        .insert({
            ...location,
            user_id: user.id,
        })
        .select()
        .single(); // return the created location

    if (error) {
        if (error.code == "23505") {// violation of unique entry in the database
            throw new Error("This location is already saved.");
        }

        throw new Error(error.message);
    }

    return data;
}

// removed a saved location
export async function deleteLocation(locationId: string): Promise<void> {
    const { error } = await supabase
        .from("saved_locations")
        .delete()
        .eq("id", locationId);

    if (error) throw new Error(error.message);
}
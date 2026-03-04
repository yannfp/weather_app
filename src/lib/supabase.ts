// intermediate between the application and our Supabase database
// allows us to communicate with the database so we can retrieve information about the users, validate or no the logins, ...

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// read API keys from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// create and export the Supabase client
// we configure it to use AsyncStorage so auth sessions persist
// (the user stays logged in even after closing the app)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,          // store the session token on device
        autoRefreshToken: true,         // automatically refresh expired tokens
        persistSession: true,           // remember login between app restarts
        detectSessionInUrl: false,
    },
});
import React, {createContext, use, useContext, useEffect, useState} from "react";
import { supabase } from "../lib/supabase";
import { AuthUser } from "../types";

// context allows us to share data across components of the app without passing it as props
// like a global var

type AuthContextType = {

    // null if user not logged in
    user: AuthUser | null;

    // true while checking if the user is logged in or no
    loading: boolean;

    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

// create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// React component accepting nested components inside itself
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // useState allows the component to remember the state of things
    // when the value changes it modifies the component accordingly to the change

    // track the user who is logged in
    // starts as null, when the app launches no user is logged in
    const [user, setUser] = useState<AuthUser | null>(null);

    const [loading, setLoading] = useState(true);

    // runs the code after the component appears on the screen
    // checks the login state when the app starts
    useEffect(() => {
        // checks if there is already a logged-in session when app launches
        supabase.auth.getSession().then(({data: {session}}) => {
            if (session?.user) {
                setUser({id: session.user.id, email: session.user.email!});
            }

            setLoading(false);
        });

        // listen for any login/logout event
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            (_event, session) => {

                if (session?.user) {
                    // someone logged
                    // save the user in state
                    setUser({id: session.user.id, email: session.user.email!});
                } else {
                    // someone logged out
                    // clear the user from state
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // calls builtin from Superbase to log in with an email and password
    // sign in with email and password
    const signIn = async (email: string, password: string) => {

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
    };

    // sames as sign in but for sign up, password hashing and security is handled by Superbase
    // sign up with email and password
    const signUp = async (email: string, password: string) => {

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);
    };

    // log out of session
    const signOut = async () => {

        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    };

    // render the 'invisible' wrapper allowing to share the data with all the objects inside itself
    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// allows any component to take the auth data from the context
export const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within the AuthProvider");
    }

    return context;
};
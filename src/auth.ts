import supabase from "./supabaseClient";
import { devLog } from "./utils";

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
        devLog("Google sign in", data);
    } catch (error) {
        devLog("Error while signin with google", error);
    }
}

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        devLog("Error while signing out", error);
    }
}
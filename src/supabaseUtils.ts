import { Session } from "@supabase/supabase-js";
import supabase from "./supabaseClient";
import { FavoritesListType, UserType } from "./types";
import { devLog } from "./utils";

export const getSession = async (): Promise<Session | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export const addUser = async (userDataFromSession: UserType) => {
    const { data, error } = await supabase
        .from("users")
        .upsert([userDataFromSession], { onConflict: "id" });

    if (error) {
        devLog("Error adding user", error);
    } else {
        devLog("User added", data);
    }
}

const getFavorites = async (user_id: string) => {
    const { data, error } = await supabase
        .from('user_lists')
        .select('*')
        .eq('user_id', user_id)
        .eq('list_name', 'Favorites')
        .single();

    if (error) {
        return null;
    }

    return data;
}

export const getFavoritesWithRetry = async (user_id: string, delay = 500) => {
    while (true) {
        const data = await getFavorites(user_id);

        if (data) {
            const favorites: FavoritesListType = {
                listId: data.list_id,
                listName: data.list_name,
                listItems: data.list_items ? data.list_items : []
            };
            return favorites;
        }

        devLog("Favorites not found, retrying in", delay, "ms...");
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
}

export const addFavorites = async (favorites: FavoritesListType, user_id: string) => {
    const { error: updateError } = await supabase
        .from('user_lists')
        .update({ list_items: favorites.listItems })
        .eq('user_id', user_id)
        .eq('list_id', favorites.listId);

    if (updateError) {
        devLog("Error updating favorites", updateError);
    } else {
        devLog("Favorites updated successfully");
    }
}
import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useState } from "react";
import { FavoritesListType, MovieType, TYShowType, UserType } from "./types";
import { v4 as uuidv4 } from "uuid";

interface ContextType {
    data: {
        movie: MovieType[];
        tv: TYShowType[];
        now_playing: MovieType[];
        top_rated: MovieType[];
        upcoming: MovieType[];
    };
    setData: React.Dispatch<React.SetStateAction<{
        movie: MovieType[],
        tv: TYShowType[],
        now_playing: MovieType[],
        top_rated: MovieType[],
        upcoming: MovieType[]
    }>>;
    fetchedMovies: Record<string, MovieType>;
    setFetchedMovies: React.Dispatch<React.SetStateAction<Record<string, MovieType>>>;
    fetchedTVShows: Record<string, TYShowType>;
    setFetchedTVShows: React.Dispatch<React.SetStateAction<Record<string, TYShowType>>>;
    pageInfo: Record<string, Record<string, number>>;
    setPageInfo: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    favorites: FavoritesListType;
    setFavorites: React.Dispatch<React.SetStateAction<FavoritesListType>>;
    toggleFavorite: (id: number, category: string) => void;
    toastInfo: Record<string, string>;
    setToastInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    showToast: (message: string, type: 'success' | 'error') => void;
    fetchedFavorites: any[];
    setFetchedFavorites: React.Dispatch<React.SetStateAction<any[]>>;
    fetchingUser: boolean;
    setFetchingUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const Context = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [data, setData] = useState<{ movie: MovieType[], tv: TYShowType[], now_playing: MovieType[], top_rated: MovieType[], upcoming: MovieType[] }>({ movie: [], tv: [], now_playing: [], top_rated: [], upcoming: [] });
    const [fetchedMovies, setFetchedMovies] = useState<Record<string, MovieType>>({});
    const [fetchedTVShows, setFetchedTVShows] = useState<Record<string, TYShowType>>({});
    const [pageInfo, setPageInfo] = useState<Record<string, Record<string, number>>>({});
    const [user, setUser] = useState<UserType | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [favorites, setFavorites] = useState<FavoritesListType>({
        listId: uuidv4(),
        listName: "Favorites",
        listItems: [],
    });

    const [toastInfo, setToastInfo] = useState<Record<string, string>>({});
    const [fetchedFavorites, setFetchedFavorites] = useState<any[]>([]);
    const [fetchingUser, setFetchingUser] = useState(true);

    const toggleFavorite = (id: number, category: string) => {
        setFavorites((prev) => {
            const exists = prev.listItems.some((item) => item.id === id);

            if (exists) {
                return {
                    ...prev,
                    listItems: prev.listItems.filter((item) => item.id !== id)
                };
            } else {
                return {
                    ...prev,
                    listItems: [{ id, category, isFavorited: true, createdAt: new Date().toISOString() }, ...prev.listItems]
                };
            }
        });
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToastInfo({
            message,
            type
        });
    };

    return (
        <Context.Provider value={{ data, setData, fetchedMovies, setFetchedMovies, fetchedTVShows, setFetchedTVShows, pageInfo, setPageInfo, user, setUser, session, setSession, favorites, setFavorites, toggleFavorite, toastInfo, setToastInfo, showToast, fetchedFavorites, setFetchedFavorites, fetchingUser, setFetchingUser }}>
            {children}
        </Context.Provider>
    );
};

const useRootContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useRootContext must be used within a ContextProvider");
    }
    return context;
}

export { Context, ContextProvider, useRootContext };

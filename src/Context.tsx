import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
    data: {
        movie: any[];
        tv: any[];
        now_playing: any[];
        top_rated: any[];
        upcoming: any[];
    };
    setData: React.Dispatch<React.SetStateAction<{
        movie: any[],
        tv: any[],
        now_playing: any[],
        top_rated: any[],
        upcoming: any[]
    }>>;
    fetchedMovies: Record<string, any>;
    setFetchedMovies: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    fetchedTVShows: Record<string, any>;
    setFetchedTVShows: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    pageInfo: Record<string, Record<string, number>>;
    setPageInfo: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const Context = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [data, setData] = useState<any>({ movie: [], tv: [], now_playing: [], top_rated: [], upcoming: [] });
    const [fetchedMovies, setFetchedMovies] = useState<Record<string, any>>({});
    const [fetchedTVShows, setFetchedTVShows] = useState<Record<string, any>>({});
    const [pageInfo, setPageInfo] = useState<Record<string, Record<string, number>>>({});
    const [session, setSession] = useState<Session | null>(null);

    return (
        <Context.Provider value={{ data, setData, fetchedMovies, setFetchedMovies, fetchedTVShows, setFetchedTVShows, pageInfo, setPageInfo, session, setSession }}>
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

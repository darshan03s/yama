import { createContext, ReactNode, useContext, useState } from "react";

interface TVShowContextType {
    selectedSeason: number;
    setSelectedSeason: React.Dispatch<React.SetStateAction<number>>;
}

const TVShowContext = createContext<TVShowContextType | undefined>(undefined);

interface TVShowContextProviderProps {
    children: ReactNode;
}

const TVShowContextProvider: React.FC<TVShowContextProviderProps> = ({ children }) => {
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    return (
        <TVShowContext.Provider value={{ selectedSeason, setSelectedSeason }}>
            {children}
        </TVShowContext.Provider>
    )
}

const useTVShowContext = () => {
    const context = useContext(TVShowContext);
    if (!context) {
        throw new Error("useTVShowContext must be used within a ContextProvider");
    }
    return context;
}

export { TVShowContext, TVShowContextProvider, useTVShowContext }

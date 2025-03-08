import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
    data: {
        discover: any[];  
    };
    setData: React.Dispatch<React.SetStateAction<{ discover: any[] }>>;
}

const Context = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [data, setData] = useState<any>({});

    return (
        <Context.Provider value={{ data, setData }}>
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

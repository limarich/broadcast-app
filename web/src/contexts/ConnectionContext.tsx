import { createContext, useContext, useState } from "react";
import type { Connection } from "../types";


export interface ConnectionContextType {
    activeConnection: Connection | null;
    onActiveConnectionChange: (connection: Connection | null) => void;
}

export const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [activeConnection, setActivedConnection] = useState<Connection | null>(() => {
        const stored = localStorage.getItem('activeConnection')
        return stored ? JSON.parse(stored) : null
    });

    const onActiveConnectionChange = (connection: Connection | null) => {
        if (connection !== null) {
            localStorage.setItem('activeConnection', JSON.stringify(connection));
        } else {
            localStorage.removeItem('activeConnection');
        }
        setActivedConnection(connection);
    };

    const value = { activeConnection, onActiveConnectionChange };

    return (
        <ConnectionContext.Provider value={value}>
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    const context = useContext(ConnectionContext);
    if (context === undefined) {
        throw new Error("useConnection must be used within a ConnectionProvider");
    }
    return context;
}
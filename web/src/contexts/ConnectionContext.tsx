import { createContext, useContext, useState } from "react";
import type { Connection } from "../types";


export interface ConnectionContextType {
    activedConnection: Connection | null;
    onActiveConnectionChange: (connection: Connection | null) => void;
}

export const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [activedConnection, setActivedConnection] = useState<Connection | null>(null);

    const onActiveConnectionChange = (connection: Connection | null) => {
        setActivedConnection(connection);
    };

    const value = { activedConnection, onActiveConnectionChange };

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
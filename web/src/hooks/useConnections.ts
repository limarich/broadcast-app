import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../lib/firebase";
import type { Connection } from "../types";

export const useConnections = (userId: string) => {

    const [connections, setConnections] = useState<Connection[]>([])

    useEffect(() => {
        const q = query(collection(db, "connections"), where("userId", "==", userId), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const connections = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Connection[];
            setConnections(connections);
        });
        return () => unsubscribe();
    }, [userId]);

    return { connections }

}
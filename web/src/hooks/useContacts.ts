import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../lib/firebase";
import type { Contact } from "../types";

export const useContacts = (userId: string, connectionId: string) => {

    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId || !connectionId) return
        const q = query(collection(db, "contacts"),
            where("userId", "==", userId),
            where("connectionId", "==", connectionId),
            orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const contacts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Contact[];
            setContacts(contacts);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [userId, connectionId]);

    return { contacts, loading }

}
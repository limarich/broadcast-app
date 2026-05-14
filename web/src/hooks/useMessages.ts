import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../lib/firebase";
import type { Message } from "../types";

export const useMessages = (userId: string, connectionId: string) => {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if (!userId || !connectionId) return
        const q = query(collection(db, "messages"),
            where("userId", "==", userId),
            where("connectionId", "==", connectionId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Message[];
            setMessages(messages);
        });
        return () => unsubscribe();
    }, [userId, connectionId]);

    return { messages }

}
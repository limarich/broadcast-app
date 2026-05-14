import { addDoc, collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface AddConnectionDTO {
    userId: string;
    name: string;
}

export interface UpdateConnectionDTO {
    id: string;
    name: string;
}

export interface DeleteConnectionDTO {
    id: string;
    userId: string;
}


export const addConnection = async ({ userId, name }: AddConnectionDTO) => {

    const connectionRef = collection(db, "connections");
    return await addDoc(connectionRef, {
        name,
        userId,
        createdAt: new Date(),
    });

}

export const updateConnection = async ({ id, name }: UpdateConnectionDTO) => {

    const connectionRef = doc(db, "connections", id);
    return await updateDoc(connectionRef, { name });

}

export const deleteConnection = async ({ id, userId }: DeleteConnectionDTO) => {
    const batch = writeBatch(db)

    const contactsSnap = await getDocs(
        query(collection(db, "contacts"),
            where("connectionId", "==", id),
            where("userId", "==", userId)
        )
    )
    contactsSnap.forEach((d) => batch.delete(d.ref))

    const messagesSnap = await getDocs(
        query(collection(db, "messages"),
            where("connectionId", "==", id),
            where("userId", "==", userId)
        )
    )
    messagesSnap.forEach((d) => batch.delete(d.ref))
    batch.delete(doc(db, "connections", id))

    return await batch.commit()
}
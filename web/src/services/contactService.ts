import { addDoc, arrayRemove, collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface AddContactDTO {
    userId: string;
    name: string;
    phone: string;
    connectionId: string;
}

export interface UpdateContactDTO {
    id: string;
    name?: string;
    phone?: string;
}

export interface DeleteContactDTO {
    id: string;
    connectionId: string;
    userId: string;
}

export const addContact = async ({ userId, name, phone, connectionId }: AddContactDTO) => {

    const contactRef = collection(db, "contacts");
    return await addDoc(contactRef, {
        name,
        userId,
        phone,
        connectionId,
        createdAt: new Date(),
    });

}

export const updateContact = async ({ id, name, phone }: UpdateContactDTO) => {

    const contactRef = doc(db, "contacts", id);
    return await updateDoc(contactRef, { name, phone });

}

export const deleteContact = async ({ id, connectionId, userId }: DeleteContactDTO) => {
    const batch = writeBatch(db)

    const messagesSnap = await getDocs(
        query(
            collection(db, "messages"),
            where("connectionId", "==", connectionId),
            where("userId", "==", userId),
            where("contactIds", "array-contains", id)
        )
    )
    messagesSnap.forEach((d) => batch.update(d.ref, { contactIds: arrayRemove(id) }))

    batch.delete(doc(db, "contacts", id))
    return await batch.commit()
}
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
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

export const deleteContact = async ({ id }: DeleteContactDTO) => {

    const contactRef = doc(db, "contacts", id);
    return await deleteDoc(contactRef);

}
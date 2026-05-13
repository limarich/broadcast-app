import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
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

export const deleteConnection = async ({ id }: DeleteConnectionDTO) => {

    const connectionRef = doc(db, "connections", id);
    return await deleteDoc(connectionRef);

}
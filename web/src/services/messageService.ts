import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { MessageStatus } from "../types";

export interface AddMessageDTO {
    userId: string;
    connectionId: string;
    content: string;
    contactIds: string[];
    scheduledAt?: Date;
}

export interface UpdateMessageDTO {
    id: string;
    content?: string;
    contactIds?: string[];
    status?: MessageStatus;
    scheduledAt?: Date;
}

export interface DeleteMessageDTO {
    id: string;
}

export const addMessage = async ({ userId, connectionId, content, contactIds, scheduledAt }: AddMessageDTO) => {

    const messageRef = collection(db, "messages");
    return await addDoc(messageRef, {
        userId,
        connectionId,
        content,
        contactIds,
        status: scheduledAt ? "SCHEDULED" : "SENT",
        ...(scheduledAt && { scheduledAt, sentAt: null }),
        createdAt: new Date(),
    });

}

export const updateMessage = async ({ id, content, contactIds, status, scheduledAt }: UpdateMessageDTO) => {

    const messageRef = doc(db, "messages", id);
    return await updateDoc(messageRef, { content, contactIds, status, scheduledAt, ...(status === "SENT" && { sentAt: new Date() }) });

}

export const deleteMessage = async ({ id }: DeleteMessageDTO) => {

    const messageRef = doc(db, "messages", id);
    return await deleteDoc(messageRef);

}
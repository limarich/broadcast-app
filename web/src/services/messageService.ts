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
        scheduledAt: scheduledAt ?? null,
        sentAt: scheduledAt ? null : new Date(),
        createdAt: new Date(),
    });

}

export const updateMessage = async ({ id, content, contactIds, status, scheduledAt }: UpdateMessageDTO) => {

    const messageRef = doc(db, "messages", id);
    const data: Record<string, unknown> = {}
    if (content !== undefined) data.content = content
    if (contactIds !== undefined) data.contactIds = contactIds
    if (status !== undefined) data.status = status
    if (scheduledAt !== undefined) data.scheduledAt = scheduledAt
    if (status === "SENT") data.sentAt = new Date()
    return await updateDoc(messageRef, data)

}

export const deleteMessage = async ({ id }: DeleteMessageDTO) => {

    const messageRef = doc(db, "messages", id);
    return await deleteDoc(messageRef);

}
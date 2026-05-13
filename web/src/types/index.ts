import type { Timestamp } from "firebase/firestore";

export interface Connection {
    id: string;
    name: string;
    userId: string;

    createdAt: Timestamp;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    connectionId: string;
    userId: string;

    createdAt: Timestamp;
}

export type MessageStatus = "SCHEDULED" | "SENT";

export interface Message {
    id: string;
    content: string;
    status: MessageStatus;
    scheduledAt?: Timestamp;
    sentAt?: Timestamp;

    userId: string;
    connectionId: string;
    contactIds: string[];

    createdAt: Timestamp;
}
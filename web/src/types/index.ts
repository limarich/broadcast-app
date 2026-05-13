export interface Connection {
    id: string;
    name: string;
    userId: string;

    createdAt: Date;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    connectionId: string;
    userId: string;

    createdAt: Date;
}

export type MessageStatus = "SCHEDULED" | "SENT";

export interface Message {
    id: string;
    content: string;
    status: MessageStatus;
    scheduledAt?: Date;
    sentAt?: Date;

    userId: string;
    connectionId: string;
    contactIds: string[];

    createdAt: Date;
}
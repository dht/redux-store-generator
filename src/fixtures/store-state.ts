import { GroupedListNode, StoreStructure } from '../types/types';

export type AppState = { isLoading: boolean; email?: string };
export type Product = { id: string; title: string };
export type Products = Record<string, Product>;
export type Log = { id: string };
export type Logs = Array<Log>;

export type Message = { id: string; timestamp: number; content: string; isMe: boolean }; // prettier-ignore
export type Chat = { id: string; title: string; items: Message[] };
export type Chats = Record<string, Chat>;

export interface MyStore extends StoreStructure {
    appState: AppState;
    products: Products;
    logs: Logs;
    chats: Chats;
}

export default {
    appState: {
        isLoading: true,
        isSaving: true,
    },
    products: {
        '1': {
            id: '1',
            title: 'first product',
        },
    },
    logs: [
        {
            id: '1',
        },
    ],
    chats: {
        '1': {
            id: '1',
            title: 'chat 1',
            items: [
                {
                    id: '1',
                    isMe: true,
                },
            ],
        },
    },
};

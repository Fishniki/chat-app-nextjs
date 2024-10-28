/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LIMIT_MESSAGES } from "@/components/constant";
import { create } from "zustand";

export type Imessage = {
    created_at: string;
    id: string;
    is_edit: boolean;
    send_by: string;
    text: string;
    users: {
        avatar_url: string;
        created_at: string;
        display_name: string;
        id: string;
    } | null;
}

interface MessageState {
    hashMore: boolean;
    page: number;
    messages: Imessage[];
    actionMessage: Imessage | undefined;
    optimisticIds: string[]
    addMessage: (message: Imessage) => void;
    setActionMessage: (message: Imessage | undefined) => void;
    optimisticDeleteMessage: (messageId: string) => void
    optimisticUpdateMessage: (message: Imessage) => void
    setOptimisticIds: (id: string) => void
    setMessages: (messages: Imessage[]) => void
}

export const useMessage = create<MessageState>()((set) => ({
    hashMore: true,
    page:1,
    messages: [],
    actionMessage: undefined,
    optimisticIds: [],

    setMessages:(messages)=>set((state) => ({
        messages: [...messages, ...state.messages],
        page: state.page + 1,
        hashMore: messages.length < LIMIT_MESSAGES
    })),

    setOptimisticIds:(id: string) => set((state) => ({
        optimisticIds: [...state.optimisticIds, id]
    })),

    addMessage:(newMessage)=>set((state) => ({
        messages: [...state.messages, newMessage],
    })),
    
    setActionMessage: (message) => set(() => ({
        actionMessage: message
    })),

    optimisticDeleteMessage:(messageId) => set((state) => {
        return {
            messages:state.messages.filter((message) => message.id !== messageId)
        }
    }),

    optimisticUpdateMessage:(updateMessage) => set((state) => {
        return {
            messages:state.messages.filter((message) => {
                if (message.id === updateMessage.id) {
                    message.text = updateMessage.text,
                    message.is_edit = updateMessage.is_edit
                }
                return message
            })
        }
    }),
    
}))

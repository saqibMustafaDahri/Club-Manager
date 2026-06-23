import { apiClient } from "@/lib/axios";

export interface Notification {
    id: string;
    participantName?: string;
    participantId?: string;
    channel?: string;
    type?: string;
    status?: string;
    sentAt?: string;
    dueDate?: string;
    balance?: number;
    lastRemindedAt?: string;
    bodyText?: string;
    [key: string]: unknown;
}

export const notificationsApi = {
    getAll: async (page = 1, limit = 20): Promise<Notification[]> => {
        const { data } = await apiClient.get<any>(
            `/notifications?page=${page}&limit=${limit}`
        );

        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data?.data)) items = data.data;
        else if (Array.isArray(data?.items)) items = data.items;
        else if (Array.isArray(data?.results)) items = data.results;
        else if (Array.isArray(data?.notifications)) items = data.notifications;
        else {
            console.warn("[DEBUG] GET /notifications unexpected shape:", data);
            return [];
        }

        return items.map((n: any) => ({
            ...n,
            participantName:
                n.participantName ??
                (n.participant
                    ? `${n.participant.firstNameEn ?? ""} ${n.participant.lastNameEn ?? ""}`.trim()
                    : n.recipientName ?? "—"),
            channel: n.channel ?? n.channels?.join(", ") ?? "—",
            type: n.type ?? n.reminderType ?? "—",
            status: n.status ?? "—",
            sentAt: n.sentAt ?? n.createdAt ?? null,
            dueDate: n.dueDate ?? null,
            balance: Number(n.balance ?? 0),
            lastRemindedAt: n.lastRemindedAt ?? n.sentAt ?? null,
        }));
    },

    retry: async (id: string): Promise<void> => {
        await apiClient.post(`/notifications/${id}/retry`);
    },
};


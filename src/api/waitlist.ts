import { apiClient } from "@/lib/axios";

export interface WaitlistEntry {
    id: string;
    position?: number;
    participantId?: string;
    participantName?: string;
    guardianPhone?: string;
    sessionId?: string;
    sessionName?: string;
    locationId?: string;
    createdAt?: string;
    expiresAt?: string;
    status?: string;
    [key: string]: unknown;
}

export const waitlistApi = {
    getAll: async (params?: { sessionId?: string; locationId?: string }): Promise<WaitlistEntry[]> => {
        const query = new URLSearchParams();
        if (params?.sessionId) query.set("sessionId", params.sessionId);
        if (params?.locationId) query.set("locationId", params.locationId);

        const { data } = await apiClient.get<any>(`/waitlist?${query.toString()}`);

        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data?.data)) items = data.data;
        else if (Array.isArray(data?.items)) items = data.items;
        else if (Array.isArray(data?.results)) items = data.results;
        else if (Array.isArray(data?.waitlist)) items = data.waitlist;
        else {
            console.warn("[DEBUG] GET /waitlist unexpected shape:", data);
            return [];
        }

        return items.map((w: any, i: number) => ({
            ...w,
            position: w.position ?? w.rank ?? i + 1,
            participantName:
                w.participantName ??
                (w.participant
                    ? `${w.participant.firstNameEn ?? ""} ${w.participant.lastNameEn ?? ""}`.trim()
                    : w.name ?? "—"),
            guardianPhone:
                w.guardianPhone ??
                w.participant?.guardian?.phone ??
                w.guardian?.phone ?? "—",
            sessionName: w.sessionName ?? w.session?.name ?? w.sessionId ?? "—",
            dateAdded: w.dateAdded ?? w.createdAt ?? null,
            expiresAt: w.expiresAt ?? w.offerExpiresAt ?? null,
            status: w.status ?? "WAITING",
        }));
    },

    offer: async (id: string): Promise<void> => {
        await apiClient.post(`/waitlist/${id}/offer`);
    },
};
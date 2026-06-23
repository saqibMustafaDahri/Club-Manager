import { apiClient } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ActivityType = "registration" | "payment" | "document" | "status" | "login" | "update";

export interface AuditLog {
    id: string;
    action: string;
    subject?: string;
    type?: ActivityType;
    userId?: string;
    userEmail?: string;
    createdAt: string;
    timestamp?: string;
    [key: string]: unknown;
}

export interface AuditVerifyChain {
    valid: boolean;
    message?: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────
export const auditApi = {
    /**
     * GET /audit/logs  (or /audit — ask your backend dev for exact path)
     * Returns recent activity logs for the dashboard feed.
     */
    getLogs: async (limit = 6): Promise<AuditLog[]> => {
        const { data } = await apiClient.get<any>(`/audit/logs?limit=${limit}`);

        // Handle all common response shapes
        const list: AuditLog[] =
            Array.isArray(data) ? data :
                Array.isArray(data?.data) ? data.data :
                    Array.isArray(data?.logs) ? data.logs :
                        Array.isArray(data?.items) ? data.items :
                            Array.isArray(data?.results) ? data.results :
                                [];

        return list.slice(0, limit);
    },

    /**
     * GET /audit/verify-chain
     * Verifies the integrity of the audit log chain.
     * This is NOT the activity feed — it's a health/integrity check.
     */
    verifyChain: async (): Promise<AuditVerifyChain> => {
        const { data } = await apiClient.get<AuditVerifyChain>("/audit/verify-chain");
        return data;
    },
};
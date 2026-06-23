import { apiClient } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GuardianProfile {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    participants?: any[];
    [key: string]: unknown;
}

export interface GuardianAuthResponse {
    accessToken: string;
    guardian: GuardianProfile;
}

// ─── Token storage (separate from admin token) ────────────────────────────────

const TOKEN_KEY = "guardian_access_token";

export const guardianTokenStorage = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── API ──────────────────────────────────────────────────────────────────────

export const guardianAuthApi = {
    /**
     * POST /guardian-auth/request-link
     * Admin calls this to send a magic link email to the guardian.
     */
    requestLink: async (tenantSlug: string, email: string): Promise<{ message: string }> => {
        const { data } = await apiClient.post<{ message: string }>(
            "/guardian-auth/request-link",
            { tenantSlug, email }
        );
        return data;
    },

    /**
     * POST /guardian-auth/verify
     * Guardian portal calls this automatically using the token from the URL.
     * Stores the returned accessToken for subsequent authenticated requests.
     */
    verifyToken: async (token: string): Promise<GuardianAuthResponse> => {
        const { data } = await apiClient.post<GuardianAuthResponse>(
            "/guardian-auth/verify",
            { token }
        );
        guardianTokenStorage.set(data.accessToken);
        return data;
    },

    /**
     * GET /guardian-auth/me
     * Fetches the authenticated guardian's profile + their participants.
     * Uses the guardian's Bearer token, not the admin token.
     */
    getMe: async (): Promise<GuardianProfile> => {
        const token = guardianTokenStorage.get();
        if (!token) throw new Error("Not authenticated as guardian.");
        const { data } = await apiClient.get<GuardianProfile>("/guardian-auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    },

    logout: () => guardianTokenStorage.clear(),
};
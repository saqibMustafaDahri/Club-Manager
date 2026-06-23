// import { apiClient } from "@/lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CapacityUtilisationItem {
//     locationId: string;
//     locationName: string;
//     used: number;
//     total: number;
//     utilizationPercent: number;
// }

// export interface ReportingDashboard {
//     activeParticipants: number;
//     newInquiries: number;
//     pendingDocuments: number;
//     pendingFees: number;
//     pendingRegistrations: number;
//     capacityUtilisation: CapacityUtilisationItem[];
// }

// // ─── Endpoints ────────────────────────────────────────────────────────────────

// export const reportsApi = {
//     /**
//      * GET /reporting/dashboard
//      * Returns summary stats and capacity utilisation per location.
//      */
//     getDashboard: async (): Promise<ReportingDashboard> => {
//         const { data } = await apiClient.get<ReportingDashboard>("/reporting/dashboard");
//         return {
//             activeParticipants: data.activeParticipants ?? 0,
//             newInquiries: data.newInquiries ?? 0,
//             pendingDocuments: data.pendingDocuments ?? 0,
//             pendingFees: data.pendingFees ?? 0,
//             pendingRegistrations: data.pendingRegistrations ?? 0,
//             capacityUtilisation: (data.capacityUtilisation ?? []).map((c) => ({
//                 locationId: c.locationId,
//                 locationName: c.locationName ?? "—",
//                 used: Number(c.used ?? 0),
//                 total: Number(c.total ?? 0),
//                 utilizationPercent: Number(c.utilizationPercent ?? 0),
//             })),
//         };
//     },
// };


import { apiClient } from "@/lib/axios";

export interface CapacityUtilisationItem {
    locationId: string;
    locationName: string;
    used: number;
    total: number;
    utilizationPercent: number;
}

export interface ReportingDashboard {
    activeParticipants: number;
    newInquiries: number;
    pendingDocuments: number;
    pendingFees: number;
    pendingRegistrations: number;
    capacityUtilisation: CapacityUtilisationItem[];
}

export interface FunnelItem {
    stage: string;
    count: number;
    dropOffRate: number;
}

export interface RevenueItem {
    month: string;
    collected: number;
    outstanding: number;
    collectedYoY: number;
}

export const reportsApi = {
    getDashboard: async (): Promise<ReportingDashboard> => {
        const { data } = await apiClient.get<ReportingDashboard>("/reporting/dashboard");
        return {
            activeParticipants: data.activeParticipants ?? 0,
            newInquiries: data.newInquiries ?? 0,
            pendingDocuments: data.pendingDocuments ?? 0,
            pendingFees: data.pendingFees ?? 0,
            pendingRegistrations: data.pendingRegistrations ?? 0,
            capacityUtilisation: (data.capacityUtilisation ?? []).map((c) => ({
                locationId: c.locationId,
                locationName: c.locationName ?? "—",
                used: Number(c.used ?? 0),
                total: Number(c.total ?? 0),
                utilizationPercent: Number(c.utilizationPercent ?? 0),
            })),
        };
    },

    getFunnel: async (startDate: string, endDate: string): Promise<FunnelItem[]> => {
        const { data } = await apiClient.get<any>(
            `/reporting/funnel?startDate=${startDate}&endDate=${endDate}`
        );
        const items: any[] = Array.isArray(data) ? data : data.items ?? data.data ?? [];
        return items.map((f) => ({
            stage: f.stage ?? "—",
            count: Number(f.count ?? 0),
            dropOffRate: Number(f.dropOffRate ?? 0),
        }));
    },

    getRevenue: async (year: number): Promise<RevenueItem[]> => {
        const { data } = await apiClient.get<any>(`/reporting/revenue?year=${year}`);
        const items: any[] = Array.isArray(data) ? data : data.items ?? data.data ?? [];
        return items.map((r) => ({
            month: r.month ?? "—",
            collected: Number(r.collected ?? 0),
            outstanding: Number(r.outstanding ?? 0),
            collectedYoY: Number(r.collectedYoY ?? 0),
        }));
    },
};
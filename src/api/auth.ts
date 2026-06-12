// import apiClient from "@/lib/axios";

// // ─── Types ───────────────────────────────────────────────────────────────────
// export interface LoginPayload {
//     tenantSlug: string;
//     email: string;
//     password: string;
// }

// export interface LoginResponse {
//     accessToken: string;
//     user: {
//         id: string;
//         email: string;
//         role: string;
//         [key: string]: unknown;
//     };
// }

// // ─── Auth Endpoints ───────────────────────────────────────────────────────────
// export const authApi = {
//     /**
//      * POST /auth/login
//      * Authenticates the user and returns an access token + user object.
//      */
//     login: async (payload: LoginPayload): Promise<LoginResponse> => {
//         const { data } = await apiClient.post<LoginResponse>("auth/login", payload);

//         // Persist token & user so the request interceptor can attach it
//         localStorage.setItem("access_token", data.accessToken);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         return data;
//     },

//     logout: () => {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("user");
//     },
// };
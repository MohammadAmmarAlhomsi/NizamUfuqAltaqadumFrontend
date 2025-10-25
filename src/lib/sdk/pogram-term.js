import { host } from "./host";
import { loadAccessToken } from "./auth";

/**
 * Fetches the current program term for the logged-in user.
 * @returns {Promise<Object|null>} The current program term object, or null if not found or unauthorized.
 */
export async function fetchCurrentTerm() {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/programTerm/current-term`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (response.status === 404) {
            console.warn("Current program term not found.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch current term.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchCurrentTerm error:", error);
        throw error;
    }
}

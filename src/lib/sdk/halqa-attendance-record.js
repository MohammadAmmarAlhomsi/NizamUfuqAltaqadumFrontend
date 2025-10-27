import { host } from "./host";
import { loadAccessToken } from "./auth";

/**
 * Update a Halqa attendance record
 *
 * @param {string} halqaAttendanceRecordId - The ID of the attendance record to update
 * @param {{ halqaId: string, attendanceDayId: string, notes?: string }} dto - The updated data
 * @returns {Promise<boolean>} Returns true if updated successfully, false otherwise
 */
export async function updateHalqaAttendance(halqaAttendanceRecordId, dto) {
    try {
        const { token } = loadAccessToken(); // your existing token loader

        const response = await fetch(`${host}/api/halqa-attendance/${halqaAttendanceRecordId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return false;
        }

        if (response.status === 403) {
            console.warn("Forbidden: You do not have permission to update this attendance record.");
            return false;
        }

        if (response.status === 404) {
            console.warn("Attendance record not found.");
            return false;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to update attendance record:", errorData.message || "Unknown error");
            return false;
        }

        return true; // Successfully updated
    } catch (error) {
        console.error("updateHalqaAttendance error:", error);
        return false;
    }
}
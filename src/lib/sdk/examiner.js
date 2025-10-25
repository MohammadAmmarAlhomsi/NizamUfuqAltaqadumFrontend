import { host } from "./host";
import { loadAccessToken } from "./auth";

/**
 * Retrieve all examiners.
 *
 * @returns {Promise<Array>} Returns a list of examiners with their user info.
 */
export async function retrieveAllExaminers() {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/Examiner/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Invalid or expired token.");
            return [];
        }

        if (response.status === 403) {
            console.warn("Forbidden: You do not have permission to read examiners.");
            return [];
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to retrieve examiners:", errorData.message || "Unknown error");
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("retrieveAllExaminers error:", error);
        return [];
    }
}

/**
 * Retrieve a single examiner by ID.
 *
 * @param {string} examinerId - The examiner’s ID.
 * @returns {Promise<Object|null>} The examiner object or null if not found.
 */
export async function retrieveExaminerById(examinerId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/Examiner/${examinerId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            console.warn("Examiner not found.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to retrieve examiner:", errorData.message || "Unknown error");
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("retrieveExaminerById error:", error);
        return null;
    }
}

/**
 * Register a new examiner.
 *
 * @param {Object} examinerData - ExaminerDto object.
 * @param {string} examinerData.username
 * @param {string} examinerData.email
 * @param {string} examinerData.password
 * @param {string} examinerData.fullName
 * @param {string} examinerData.phoneNumber
 * @param {string} examinerData.userId
 * @param {string} [examinerData.notes]
 * @returns {Promise<boolean>} True if created successfully.
 */
export async function registerExaminer(examinerData) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/Examiner/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(examinerData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to register examiner:", errorData.message || "Unknown error");
            return false;
        }

        return true;
    } catch (error) {
        console.error("registerExaminer error:", error);
        return false;
    }
}

/**
 * Update an existing examiner by ID.
 *
 * @param {string} examinerId - The ID of the examiner to update.
 * @param {Object} examinerData - Updated ExaminerDto data.
 * @returns {Promise<boolean>} True if updated successfully.
 */
export async function updateExaminer(examinerId, examinerData) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/Examiner/${examinerId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(examinerData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to update examiner:", errorData.message || "Unknown error");
            return false;
        }

        return true;
    } catch (error) {
        console.error("updateExaminer error:", error);
        return false;
    }
}

/**
 * Delete an examiner by ID.
 *
 * @param {string} examinerId - The ID of the examiner to delete.
 * @returns {Promise<boolean>} True if deleted successfully.
 */
export async function deleteExaminer(examinerId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/Examiner/${examinerId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Invalid or expired token.");
            return false;
        }

        if (response.status === 403) {
            console.warn("Forbidden: You do not have permission to delete this examiner.");
            return false;
        }

        if (response.status === 404) {
            console.warn("Examiner not found.");
            return false;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to delete examiner:", errorData.message || "Unknown error");
            return false;
        }

        return true;
    } catch (error) {
        console.error("deleteExaminer error:", error);
        return false;
    }
}

/**
 * Retrieve the examiner paired with the currently logged-in user
 *
 * @returns {Promise<Object|null>} Examiner data if found, otherwise null
 */
export async function fetchPairedExaminer() {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/examiner/paired-examiner`, {
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
            console.warn("No paired examiner found for this user.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to fetch paired examiner:", errorData.message || "Unknown error");
            return null;
        }

        let r = await response.json();
        console.log("response: ", r);
        return r // Return the examiner object
    } catch (error) {
        console.error("getPairedExaminer error:", error);
        return null;
    }
}
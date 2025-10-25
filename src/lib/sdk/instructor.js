import { loadAccessToken } from "./auth";
import { host } from "./host";

/**
 * Sends a request to create a new instructor.
 *
 * @param {Object} instructorDto - The instructor data.
 * @param {string} instructorDto.username
 * @param {string} instructorDto.email
 * @param {string} instructorDto.password
 * @param {string} instructorDto.fullName
 * @param {string} instructorDto.phoneNumber
 * @param {string} instructorDto.livingEmirate
 * @param {string} instructorDto.livingRegion
 * @param {string} instructorDto.birthDate - ISO date string (e.g. "2025-09-14T00:00:00Z").
 * @param {string} instructorDto.notes
 * @returns {Promise<Object>} The created instructor response from the server.
 */
export async function createInstructor(instructorDto) {
    try {
        let { token } = loadAccessToken();
        const response = await fetch(`${host}/api/instructor/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(instructorDto)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create instructor");
        }

        return await response.json();
    } catch (error) {
        console.error("createInstructor error:", error);
        throw error;
    }
}


/**
 * Fetches all instructors from the server.
 *
 * @param {string} token - The Bearer token for authentication.
 * @returns {Promise<Object[]>} A list of instructors from the server.
 */
export async function retrieveInstructors() {
    try {
        const { token } = loadAccessToken();
        const response = await fetch(`${host}/api/instructor/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch instructors");
        }

        return await response.json();
    } catch (error) {
        console.error("getAllInstructors error:", error);
        throw error;
    }
}

export async function verifyCreateInstructorPermission() {
    try {
        const { token } = loadAccessToken();
        const response = await fetch(`${host}/api/instructor/verify-create-permission`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch instructors");
        }
    }
    catch (error) {
        console.error("verifyCreateInstructorPermission error:", error);
        throw error;
    }
}

/**
 * Verifies if the current user has permission to update a specific instructor.
 *
 * @param {string} instructorId - The GUID of the instructor to verify.
 * @returns {Promise<boolean>} True if the user has permission, false otherwise.
 */
export async function verifyUpdateInstructorPermission(instructorId) {
    try {
        const { token } = loadAccessToken(); // assumes you have a function to load the access token

        const response = await fetch(`${host}/api/instructor/${instructorId}/verify-update-permission`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to verify update permission");
        }
    } catch (error) {
        console.error("verifyUpdateInstructorPermission error:", error);
        throw error;
    }
}


/**
 * Sends a request to update an existing instructor.
 *
 * @param {string} instructorId - The unique instructor GUID.
 * @param {Object} instructorDto - The updated instructor data.
 * @param {string} instructorDto.username
 * @param {string} instructorDto.email
 * @param {string} instructorDto.password
 * @param {string} instructorDto.fullName
 * @param {string} instructorDto.phoneNumber
 * @param {string} instructorDto.livingEmirate
 * @param {string} instructorDto.livingRegion
 * @param {string} instructorDto.birthDate - ISO date string (e.g. "1985-03-15T00:00:00Z").
 * @param {string} instructorDto.notes
 * @returns {Promise<Object>} The updated instructor response from the server.
 */
export async function updateInstructorAsync(instructorId, instructorDto) {
    try {
        const { token } = loadAccessToken();
        const response = await fetch(`${host}/api/instructor/update/${instructorId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(instructorDto)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update instructor");
        }

        return await response.json();
    } catch (error) {
        console.error("updateInstructor error:", error);
        throw error;
    }
}

/**
 * Fetches an instructor by ID.
 *
 * @param {string} instructorId - The GUID of the instructor to fetch.
 * @returns {Promise<Object>} The instructor data from the server.
 */
export async function getInstructorById(instructorId) {
    try {
        const { token } = loadAccessToken(); // assuming you have a function to get the auth token

        const response = await fetch(`${host}/api/instructor/${instructorId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch instructor");
        }

        return await response.json();
    } catch (error) {
        console.error("getInstructorById error:", error);
        throw error;
    }
}

/**
 * Fetches the instructor paired with the current logged-in user.
 * @returns {Promise<Object|null>} The paired instructor object, or null if not found or unauthorized.
 */
export async function fetchPairedInstructor() {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/instructor/get-paired`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            console.warn("This is not an instructor account.");
            return null;
        }

        if (response.status === 404) {
            console.warn("Unable to find paired instructor.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch paired instructor.");
        }

        return await response.json();
    } catch (error) {
        console.error("getPairedInstructor error:", error);
        throw error;
    }
}

/**
 * Fetches the Halqat (circles) that the current logged-in instructor is responsible for.
 * @returns {Promise<Array<Object>|null>} An array of Halqat with their students, or null if not found or unauthorized.
 */
export async function fetchResponsibleHalqat() {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/instructor/halqat`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            console.warn("This is not an instructor account.");
            return null;
        }

        if (response.status === 404) {
            console.warn("Unable to find responsible halqat.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch responsible halqat.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchResponsibleHalqat error:", error);
        throw error;
    }
}


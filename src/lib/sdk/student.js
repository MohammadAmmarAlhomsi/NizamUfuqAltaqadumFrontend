import { host } from "./host";
import { loadAccessToken } from "./auth";

/**
 * Verifies if the current user has permission to create a student in a specific Halqa.
 * @param {string} halqaId - The GUID of the Halqa to verify.
 * @returns {Promise<boolean>} True if the user has permission, false otherwise.
 */
export async function verifyCreateStudentPermission(halqaId) {
    try {
        const { token } = loadAccessToken(); // assumes you have a function to load the access token

        const response = await fetch(`${host}/api/student/verify-create-permission?halqaId=${halqaId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403) {
            return false; // no permission
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to verify create permission");
        }

        return true; // permission granted
    } catch (error) {
        console.error("verifyCreateStudentPermission error:", error);
        throw error;
    }
}

/**
 * Verifies if the current user has permission to update a specific student.
 * @param {string} studentId - The GUID of the student to verify.
 * @returns {Promise<boolean>} True if the user has permission, false otherwise.
 */
export async function verifyUpdateStudentPermission(studentId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/${studentId}/verify-update-permission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403) {
            return false; // no permission
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to verify update permission");
        }

        return true; // permission granted
    } catch (error) {
        console.error("verifyUpdateStudentPermission error:", error);
        throw error;
    }
}

/**
 * Creates a new student in the system.
 * @param {Object} studentDto - The student data to create.
 * @param {string} studentDto.FullName
 * @param {string} studentDto.FatherName
 * @param {string} studentDto.MotherName
 * @param {string} studentDto.BirthDate - ISO string
 * @param {string} studentDto.Nationality
 * @param {string} studentDto.School
 * @param {string} studentDto.PhoneNumber
 * @param {string} studentDto.FatherPhoneNumber
 * @param {string} studentDto.MotherPhoneNumber
 * @param {string} studentDto.FatherWork
 * @param {string} studentDto.MotherWork
 * @param {string} studentDto.HalqaId - GUID
 * @param {string} studentDto.Emriate
 * @param {string} studentDto.Region
 * @param {string} studentDto.Notes
 * @returns {Promise<Object>} The created student object
 */
export async function createStudent(studentDto) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentDto)
        });

        if (response.status === 403) {
            throw new Error("You do not have permission to create a student.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create student.");
        }

        return await response.json();
    } catch (error) {
        console.error("createStudent error:", error);
        throw error;
    }
}

/**
 * Fetches all students from the API.
 *
 * @returns {Promise<Array>} A list of student objects.
 */
export async function retrieveAllStudents() {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch students");
        }

        return await response.json(); // list of mapped students
    } catch (error) {
        console.error("getAllStudents error:", error);
        throw error;
    }
}

/**
 * Fetches a single student by ID.
 *
 * @param {string} studentId - The GUID of the student to fetch.
 * @returns {Promise<Object|null>} The student object, or null if not found.
 */
export async function getStudentById(studentId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/${studentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            return null; // student not found
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch student");
        }

        return await response.json(); // student object
    } catch (error) {
        console.error("getStudentById error:", error);
        throw error;
    }
}

/**
 * Updates an existing student in the system.
 * @param {string} studentId - The GUID of the student to update.
 * @param {Object} studentDto - The student data to update.
 * @param {string} studentDto.FullName
 * @param {string} studentDto.FatherName
 * @param {string} studentDto.MotherName
 * @param {string} studentDto.BirthDate - ISO string
 * @param {string} studentDto.Nationality
 * @param {string} studentDto.School
 * @param {string} studentDto.PhoneNumber
 * @param {string} studentDto.FatherPhoneNumber
 * @param {string} studentDto.MotherPhoneNumber
 * @param {string} studentDto.FatherWork
 * @param {string} studentDto.MotherWork
 * @param {string} studentDto.HalqaId - GUID
 * @param {string} studentDto.Emirate
 * @param {string} studentDto.Region
 * @param {string} studentDto.Notes
 * @returns {Promise<Object>} The updated student object
 */
export async function updateStudentAsync(studentId, studentDto) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/update/${studentId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentDto)
        });

        if (response.status === 403) {
            throw new Error("You do not have permission to update this student.");
        }

        if (response.status === 404) {
            throw new Error("Student not found.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update student.");
        }

        return await response.json();
    } catch (error) {
        console.error("updateStudent error:", error);
        throw error;
    }
}

/**
 * Fetches all accessible pages for a specific student.
 * @param {string} studentId - The unique identifier of the student.
 * @returns {Promise<Array<Object>|null>} An array of accessible pages, or null if not found or unauthorized.
 */
export async function fetchAllAccessibleStudentPages(studentId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/${studentId}/page/accessible-pages/all`, {
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
            console.warn(`No accessible pages found for student ${studentId}.`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch accessible student pages.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchAllAccessibleStudentPages error:", error);
        throw error;
    }
}

/**
 * Fetches all accessible pages along with recitation and reward cancellation records for a specific student.
 * @param {string} studentId - The unique identifier of the student.
 * @returns {Promise<Object|null>} An object containing AccessiblePages, RecitationRecords, and RewardCancellationRecords, or null if not found or unauthorized.
 */
export async function fetchAccessiblePagesOverview(studentId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/student/${studentId}/page/accessible-pages/overview`, {
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
            console.warn(`No accessible pages found for student ${studentId}.`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch accessible pages overview.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchAccessiblePagesOverview error:", error);
        throw error;
    }
}

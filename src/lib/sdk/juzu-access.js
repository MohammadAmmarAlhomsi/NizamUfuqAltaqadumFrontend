import { host } from "$lib/sdk/host";
import { loadAccessToken } from "$lib/sdk/auth";

/**
 * Register new Juzu access for a student.
 * @param {number} juzuNumber - The Juzu number (1–30).
 * @param {string} studentId - The student's ID.
 * @returns {Promise<Object|null>}
 */
export async function registerJuzuAccess(juzuNumber, studentId) {
  if (!juzuNumber || !studentId) throw new Error("juzuNumber and studentId are required");

  try {
    const { token } = loadAccessToken();

    const response = await fetch(`${host}/api/juzu-access/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ juzuNumber, studentId })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Failed to register Juzu access:", error);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Error while registering Juzu access:", err);
    return null;
  }
}

/**
 * Fetch all Juzu access records for a student.
 * @param {string} studentId - The student's ID.
 * @returns {Promise<Array>} - List of Juzu access records.
 */
export async function fetchAllJuzuAccesses(studentId) {
  if (!studentId) throw new Error("studentId is required");

  try {
    const { token } = loadAccessToken();

    const response = await fetch(`${host}/api/juzu-access/student/${studentId}/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Failed to fetch Juzu accesses:", error);
      return [];
    }

    return await response.json();
  } catch (err) {
    console.error("Error while fetching Juzu accesses:", err);
    return [];
  }
}

/**
 * Delete a Juzu access record.
 * @param {string} recordId - The ID of the record to delete.
 * @returns {Promise<boolean>}
 */
export async function deleteJuzuAccess(recordId) {
  if (!recordId) throw new Error("recordId is required");

  try {
    const { token } = loadAccessToken();

    const response = await fetch(`${host}/api/juzu-access/${recordId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Failed to delete Juzu access:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error while deleting Juzu access:", err);
    return false;
  }
}

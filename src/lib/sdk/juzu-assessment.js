import { loadAccessToken } from "$lib/sdk/auth";
import { host } from "$lib/sdk/host";

/**
 * Fetch a specific Juzu assessment by its ID.
 * @param {string} assessmentId - The ID of the assessment.
 * @returns {Promise<Object|null>} The assessment record or null if not found.
 */
export async function fetchJuzuAssessment(assessmentId) {
  if (!assessmentId) throw new Error("assessmentId is required");

  try {
    const { token } = loadAccessToken();
    const response = await fetch(`${host}/api/juzu-assessment/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch Juzu assessment:", await response.text());
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching Juzu assessment:", err);
    return null;
  }
}

/**
 * Fetch all Juzu assessments for a specific student.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Array>} List of assessments.
 */
export async function fetchStudentAssessments(studentId) {
  if (!studentId) throw new Error("studentId is required");

  try {
    const { token } = loadAccessToken();
    const response = await fetch(`${host}/api/juzu-assessment/student/${studentId}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch student assessments:", await response.text());
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching student assessments:", err);
    return [];
  }
}

/**
 * Register a new Juzu assessment.
 * @param {Object} dto - The Juzu assessment data.
 * @param {number} dto.JuzuNumber - The Juzu number.
 * @param {number} dto.Grade - The assessment grade.
 * @param {string} dto.StudentId - The student ID.
 * @param {string} [dto.Notes] - Optional notes.
 * @returns {Promise<Object|null>} Created assessment record or null.
 */
export async function registerJuzuAssessment(dto) {
  if (!dto?.juzuNumber || !dto?.grade || !dto?.studentId)
    throw new Error("JuzuNumber, Grade, and StudentId are required");

  try {
    const { token } = loadAccessToken();
    const response = await fetch(`${host}/api/juzu-assessment/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 409) {
      const err = await response.json();
      alert(err.error || "Assessment for this Juzu already exists.");
      return null;
    }

    if (!response.ok) {
      console.error("Failed to register Juzu assessment:", await response.text());
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Error registering Juzu assessment:", err);
    return null;
  }
}

/**
 * Delete a Juzu assessment by ID.
 * @param {string} assessmentId - The ID of the assessment.
 * @returns {Promise<boolean>} True if deleted successfully, false otherwise.
 */
export async function deleteJuzuAssessment(assessmentId) {
  if (!assessmentId) throw new Error("assessmentId is required");

  try {
    const { token } = loadAccessToken();
    const response = await fetch(`${host}/api/juzu-assessment/${assessmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Failed to delete Juzu assessment:", await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error deleting Juzu assessment:", err);
    return false;
  }
}

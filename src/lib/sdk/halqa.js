import { host } from "./host";
import { loadAccessToken } from "./auth";

/**
 * Fetches all halqat from the server.
 *
 * @returns {Promise<Object[]>} A list of halqat with instructor and students.
 */
export async function retrieveAllHalqat() {
    try {
        const { token } = loadAccessToken();
        const response = await fetch(`${host}/api/halqa/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch halqat");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Creates a new halqa on the server.
 *
 * @param {Object} halqa - The halqa data.
 * @param {string} halqa.name - The name of the halqa.
 * @param {string} halqa.instructorId - The instructor's Guid (as string).
 * @returns {Promise<Object>} The created halqa details from the server.
 */
export async function createHalqa(halqa) {
    try {
        const { token } = loadAccessToken();
        const response = await fetch(`${host}/api/halqa/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(halqa)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create halqa");
        }

        return await response.json();
    } catch (error) {
        console.error("createHalqa error:", error);
        throw error;
    }
}

/**
 * Fetches a halqa by ID.
 *
 * @param {string} halqaId - The GUID of the halqa to fetch.
 * @returns {Promise<Object>} The halqa data from the server.
 */
export async function fetchHalqaById(halqaId) {
    try {
        const { token } = loadAccessToken(); // assuming you have a function to get the auth token

        const response = await fetch(`${host}/api/halqa/${halqaId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch halqa");
        }

        return await response.json();
    } catch (error) {
        console.error("getHalqaById error:", error);
        throw error;
    }
}

/**
 * Verifies if the current user has permission to update a specific halqa.
 *
 * @param {string} halqaId - The GUID of the halqa to verify.
 * @returns {Promise<boolean>} True if the user has permission, false otherwise.
 */
export async function verifyUpdateHalqaPermission(halqaId) {
    try {
        const { token } = loadAccessToken(); // assumes you have a function to load the access token

        const response = await fetch(`${host}/api/halqa/${halqaId}/verify-update-permission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to verify halqa update permission");
        }

        // Return true if 200 OK
        return true;
    } catch (error) {
        console.error("verifyUpdateHalqaPermission error:", error);
        throw error;
    }
}

/**
 * Sends a request to update an existing halqa.
 *
 * @param {string} halqaId - The unique halqa GUID.
 * @param {Object} halqaDto - The updated halqa data.
 * @param {string} halqaDto.name - The halqa name.
 * @param {string} halqaDto.instructorId - The instructor's GUID.
 * @param {string} [halqaDto.notes] - Optional notes for the halqa.
 * @returns {Promise<Object>} The updated halqa response from the server.
 */
export async function updateHalqaAsync(halqaId, halqaDto) {
    try {
        const { token } = loadAccessToken();
        const response = await fetch(`${host}/api/halqa/update/${halqaId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(halqaDto)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update halqa");
        }

        return await response.json();
    } catch (error) {
        console.error("updateHalqaAsync error:", error);
        throw error;
    }
}

/**
 * Fetches available attendance days for a specific halqa.
 * @param {string} halqaId - The unique identifier of the halqa.
 * @returns {Promise<Array<Object>|null>} An array of attendance day objects, or null if not found or unauthorized.
 */
export async function fetchAvailableAttendanceDays(halqaId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/${halqaId}/available-attendance-days`, {
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
            console.warn(`No available attendance days found for halqa ${halqaId}.`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch available attendance days.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchAvailableAttendanceDays error:", error);
        throw error;
    }
}

/**
 * Registers halqa attendance.
 * @param {Object} dto - The attendance data.
 * @param {string} dto.halqaId - The unique identifier of the halqa.
 * @param {string} dto.attendanceDayId - The ID of the attendance day record.
 * @param {string} [dto.notes] - Optional notes.
 * @returns {Promise<Object|null>} The created halqa attendance record, or null if unauthorized.
 */
export async function registerHalqaAttendance(dto) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/attendance/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to register halqa attendance.");
        }

        return await response.json();
    } catch (error) {
        console.error("registerHalqaAttendance error:", error);
        throw error;
    }
}

/**
 * Registers student attendance for a halqa.
 * @param {Object} dto - The student attendance data.
 * @param {string} dto.studentId - The unique identifier of the student.
 * @param {string} dto.status - The attendance status (e.g. 'Present', 'Absent', etc.).
 * @param {string} dto.halqaAttendanceRecordId - The halqa attendance record ID.
 * @param {string} dto.date - The date of attendance (ISO 8601 format).
 * @param {string} [dto.notes] - Optional notes.
 * @returns {Promise<Object|null>} The created student attendance record, or null if unauthorized.
 */
export async function registerStudentAttendance(dto) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/student/attendance/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to register student attendance.");
        }

        return await response.json();
    } catch (error) {
        console.error("registerStudentAttendance error:", error);
        throw error;
    }
}

/**
 * Updates a student attendance record.
 * @param {Object} dto - The student attendance data to update.
 * @param {string} studentAttendanceId - The unique identifier of the student attendance record.
 * @param {string} [dto.status] - The updated attendance status (e.g. 'Present', 'Absent', etc.).
 * @param {string} [dto.notes] - Optional updated notes.
 * @returns {Promise<Object|null>} The updated student attendance record, or null if unauthorized.
 */
export async function updateStudentAttendance(studentAttendanceId, dto) {
    try {
        const { token } = loadAccessToken();

        if (!studentAttendanceId) {
            throw new Error("studentAttendanceId is required to update attendance.");
        }

        const response = await fetch(`${host}/api/halqa/student/attendance/${studentAttendanceId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update student attendance.");
        }

        return await response.json();
    } catch (error) {
        console.error("updateStudentAttendance error:", error);
        throw error;
    }
}

/**
 * Registers detailed student attendance for a halqa.
 * @param {Object} dto - The detailed student attendance data.
 * @param {string} dto.studentId - The unique identifier of the student.
 * @param {string|null} [dto.status] - The attendance status (e.g. 'Present', 'Absent', etc.). Nullable.
 * @param {string} dto.halqaAttendanceRecordId - The halqa attendance record ID.
 * @param {string[]} dto.pagesIds - List of page GUIDs associated with this attendance.
 * @param {string} [dto.notes=""] - Optional notes.
 * @returns {Promise<Object|null>} The created detailed student attendance record, or null if unauthorized.
 */
export async function registerStudentAttendanceDetailed(dto) {
    try {
        const { token } = loadAccessToken(); // assumes a function that retrieves your stored token

        const response = await fetch(`${host}/api/student/attendance/register-detailed`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentId: dto.studentId,
                status: dto.status ?? null,
                halqaAttendanceRecordId: dto.halqaAttendanceRecordId,
                pagesIds: dto.pagesIds || [],
                notes: dto.notes || ""
            })
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to register detailed student attendance.");
        }

        return await response.json();
    } catch (error) {
        console.error("registerStudentAttendanceDetailed error:", error);
        throw error;
    }
}


/**
 * Registers a student's page recitation for an attendance record.
 * @param {Object} dto - The page recitation data.
 * @param {number} dto.pageNumber - The page number recited.
 * @param {string} dto.studentAttendanceRecordId - The student's attendance record ID.
 * @returns {Promise<Object|null>} The created page recitation record, or null if unauthorized.
 */
export async function registerPageRecitation(dto) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/student/attendance/page-recitation`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to register page recitation.");
        }

        return await response.json();
    } catch (error) {
        console.error("registerPageRecitation error:", error);
        throw error;
    }
}

/**
 * Registers multiple page recitations for a student's attendance record.
 * @param {Object} dto - The pages recitation data.
 * @param {string[]} dto.pagesIds - The list of page IDs recited.
 * @param {string} dto.studentAttendanceRecordId - The student's attendance record ID.
 * @returns {Promise<Object|null>} The created page recitations record, or null if unauthorized.
 */
export async function registerPageRecitations(dto) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/student/attendance/page-recitation-many`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to register multiple page recitations.");
        }

        return await response.json();
    } catch (error) {
        console.error("registerPageRecitations error:", error);
        throw error;
    }
}


/**
 * Fetches all attendance records for a specific halqa.
 * @param {string} halqaId - The unique identifier of the halqa.
 * @returns {Promise<Array<Object>|null>} An array of attendance records, or null if not found or unauthorized.
 */
export async function fetchAllHalqaAttendances(halqaId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/${halqaId}/attendance/all`, {
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
            console.warn(`No attendance records found for halqa ${halqaId}.`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch halqa attendance records.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchAllHalqaAttendances error:", error);
        throw error;
    }
}

/**
 * Fetches a specific attendance record for a given halqa and record ID.
 * @param {string} halqaId - The unique identifier of the halqa.
 * @param {string} recordId - The unique identifier of the attendance record.
 * @returns {Promise<Object|null>} The attendance record object, or null if not found or unauthorized.
 */
export async function fetchHalqaAttendanceRecord(halqaId, recordId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/${halqaId}/attendance/${recordId}`, {
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
            console.warn(`Attendance record ${recordId} not found for halqa ${halqaId}.`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch attendance record.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchAttendanceRecord error:", error);
        throw error;
    }
}

/**
 * Fetches a specific student's attendance record within a halqa attendance record.
 * @param {string} halqaId - The unique identifier of the halqa.
 * @param {string} halqaAttendanceRecordId - The unique identifier of the halqa attendance record.
 * @param {string} studentAttendanceId - The unique identifier of the student attendance record.
 * @returns {Promise<Object|null>} The student attendance record object, or null if not found or unauthorized.
 */
export async function fetchStudentAttendanceRecord(halqaId, halqaAttendanceRecordId, studentAttendanceId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(
            `${host}/api/halqa/${halqaId}/attendance/${halqaAttendanceRecordId}/student-attendance/${studentAttendanceId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (response.status === 404) {
            console.warn(`Student attendance record ${studentAttendanceId} not found for halqa ${halqaId}.`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch student attendance record.");
        }

        return await response.json();
    } catch (error) {
        console.error("fetchStudentAttendanceRecord error:", error);
        throw error;
    }
}

/**
 * Cancels the reward for a specific Page Recitation Record.
 *
 * @param {string} pageRecitationRecordId - The Guid of the PageRecitationRecord to cancel the reward for.
 * @returns {Promise<void>} Resolves if successful; throws an error if request fails.
 */
export async function cancelPageRecitationReward(pageRecitationRecordId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/student/attendance/page-recitation/${pageRecitationRecordId}/cancel-reward`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to cancel page recitation reward");
        }

        return; // success — endpoint returns Ok() with no body
    } catch (error) {
        console.error("cancelPageRecitationReward error:", error);
        throw error;
    }
}

/**
 * Adds an individual activity record for a specific student.
 *
 * @param {ActivityDto} activity - The activity data object.
 * @returns {Promise<Object|null>} The created student activity record, or null if unauthorized or not found.
 *
 * @example
 * await addIndividualActivity({
 *   name: "Memorization Test",
 *   studentId: "6a4cf6e0-25b9-48df-934a-33d47a0535ac",
 *   notes: "Excellent progress.",
 *   weight: 10
 * });
 */
export async function addIndividualActivity(activity) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/student/add-indivisual-activity`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(activity)
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return null;
        }

        if (response.status === 403) {
            console.warn("Forbidden: You do not have permission to add an activity.");
            return null;
        }

        if (response.status === 404) {
            const errorData = await response.json().catch(() => ({}));
            console.warn(errorData.error || "Student or Halqa not found.");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to add individual activity.");
        }

        return await response.json();
    } catch (error) {
        console.error("addIndividualActivity error:", error);
        throw error;
    }
}

/**
 * Deletes a page recitation record for a student.
 * @param {string} pageRecitationId - The GUID of the page recitation record to delete.
 * @returns {Promise<void>}
 * @throws Will throw an error if the request fails.
 */
export async function deletePageRecitationRecordAsync(pageRecitationId) {
    try {
        const { token } = loadAccessToken(); // Your function to load the auth token

        const response = await fetch(`${host}/api/halqa/student/attendance/page-recitation/${pageRecitationId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403) {
            throw new Error("You do not have permission to delete this page recitation record.");
        }

        if (response.status === 404) {
            throw new Error("Page recitation record not found.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to delete page recitation record.");
        }

        return;
    } catch (error) {
        console.error("deletePageRecitationRecordAsync error:", error);
        throw error;
    }
}

/**
 * Deletes a page recitation reward cancellation record for a student.
 * @param {string} pageRecitationRewardRecordId - The GUID of the reward cancellation record to delete.
 * @returns {Promise<void>}
 * @throws Will throw an error if the request fails.
 */
export async function deletePageRecitationRewardCancellationRecordAsync(pageRecitationRewardRecordId) {
    try {
        const { token } = loadAccessToken();

        const response = await fetch(`${host}/api/halqa/student/attendance/page-recitation-reward-record/${pageRecitationRewardRecordId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403) {
            throw new Error("You do not have permission to delete this reward cancellation record.");
        }

        if (response.status === 404) {
            throw new Error("Reward cancellation record not found.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to delete reward cancellation record.");
        }

        return;
    } catch (error) {
        console.error("deletePageRecitationRewardCancellationRecordAsync error:", error);
        throw error;
    }
}

/**
 * Adds a group activity record for a specific halqa.
 *
 * @param {Object} dto - Group activity details.
 * @param {string} dto.halqaId - The GUID of the halqa.
 * @param {string} dto.name - Activity name/title.
 * @param {string} [dto.notes] - Optional notes.
 * @param {Array<{studentId: string, weight: number}>} dto.weights - Student weights.
 *
 * @returns {Promise<Array<Object>|null>} The list of created activity records, or null if unauthorized or not found.
 */
export async function addGroupActivities(dto) {
  try {
    const { token } = loadAccessToken();

    const response = await fetch(`${host}/api/halqa/student/add-group-activity`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 401) {
      console.warn("Unauthorized: Access token is invalid or expired.");
      return null;
    }

    if (response.status === 403) {
      console.warn("Forbidden: You do not have permission to add group activities.");
      return null;
    }

    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(errorData.error || "One or more students or halqas not found.");
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add group activities.");
    }

    return await response.json();
  } catch (error) {
    console.error("addGroupActivities error:", error);
    throw error;
  }
}

/**
 * Delete a group activity by ID
 *
 * @param {string} groupActivityId - The ID of the group activity to delete
 * @returns {Promise<boolean>} Returns true if deleted successfully, false otherwise
 */
export async function deleteGroupActivity(groupActivityId) {
    try {
        const { token } = loadAccessToken(); // Your token loader function

        const response = await fetch(`${host}/api/halqa/student/group-activity/${groupActivityId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            console.warn("Unauthorized: Access token is invalid or expired.");
            return false;
        }

        if (response.status === 403) {
            console.warn("Forbidden: You do not have permission to delete this group activity.");
            return false;
        }

        if (response.status === 404) {
            console.warn("Group activity not found.");
            return false;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to delete group activity:", errorData.message || "Unknown error");
            return false;
        }

        return true; // Successfully deleted
    } catch (error) {
        console.error("deleteGroupActivity error:", error);
        return false;
    }
}


/**
 * Fetch all group activities for a specific halqa.
 * @param {string} halqaId - The ID of the halqa.
 * @returns {Promise<Array>} - List of activity objects.
 */
export async function fetchHalqaGroupActivities(halqaId) {
  if (!halqaId) throw new Error("halqaId is required");

  try {
    const { token } = loadAccessToken();

    const response = await fetch(`${host}/api/halqa/${halqaId}/student/group-activity/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Failed to fetch group activities:", error);
      return null;
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error while fetching group activities:", err);
    return null;
  }
}

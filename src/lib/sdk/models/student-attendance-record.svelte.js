import { APIModel } from "../api-model.svelte";
import { APIGet, APIGetArray } from "../api-request";
import { host } from "../host";

/** @typedef {{'Attended', 'AttendedLate', 'AbscentWithExecuse', 'AbscentWithoutExecuse', ''} AttendanceStatus} */

export class StudentAttendanceRecord extends APIModel {

    static getAllEndPoint() { return `${host}/api/student-attendance/all`; }
    static getEndPoint(id) { return `${host}/api/student-attendance/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/student-attendance/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/student-attendance/${id}`; }

    static getHalqaReceordsEndPoint(halqaAttendanceId) { return `${host}/api/student-attendance/halqa-attendance/${halqaAttendanceId}/student-attendance/all` }

    /**
     * @param {string} halqaAttendanceId 
     * @returns {Array<StudentAttendanceRecord>}
     */
    static async getHalqaAttendanceStudentAttendanceRecords(halqaAttendanceId) {
        return await APIGetArray(this.getHalqaReceordsEndPoint(halqaAttendanceId), StudentAttendanceRecord);
    }

    /**
     * @param {string} studentId 
     * @param {string} halqaAttendanceRecordId 
     * @param {string} status 
     * @param {string} notes
     */
    constructor(studentId = '', halqaAttendanceRecordId = '', status = '', notes = '') {
        super();

        /** @type {String} */ this.studentId = $state(studentId);
        /** @type {String} */ this.halqaAttendanceRecordId = $state(halqaAttendanceRecordId);
        /** @type {AttendanceStatus} */ this.status = $state(status);
        /** @type {String} */ this.notes = $state(notes);
    }
}
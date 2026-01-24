import { APIModel } from "../api-model.svelte";
import { APIGet, APIGetArrayModel, APIPost } from "../api-request";
import { host } from "../host";

export class HalqaAttendanceSummary extends APIModel {

    constructor(attendedCount = 0, attendedLateCount = 0, abscentWithExecuseCount = 0, abscentWithoutExecuseCount = 0, notSelectedCount = 0) {
        super();

        /** @type {String} */ this.halqaAttendanceRecordId = $state('')
        /** @type {Number} */ this.attendedCount = $state(attendedCount);
        /** @type {Number} */ this.attendedLateCount = $state(attendedLateCount);
        /** @type {Number} */ this.abscentWithExecuseCount = $state(abscentWithExecuseCount);
        /** @type {Number} */ this.abscentWithoutExecuseCount = $state(abscentWithoutExecuseCount);
        /** @type {Number} */ this.notSelectedCount = $state(notSelectedCount);
    }
}

export class HalqaAttendanceRecord extends APIModel {

    // API endpoints
    static getAllEndPoint() { return `${host}/api/halqa-attendance/all`; }
    static getEndPoint(id) { return `${host}/api/halqa-attendance/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/halqa-attendance/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/halqa-attendance/${id}`; }
    static halqaRecordsEndPoint(halqaId) { return `${host}/api/halqa-attendance/halqa/${halqaId}/all`; }

    /**
     * @param {string} halqaId
     * @returns {Array<HalqaAttendanceRecord>}
     */
    static async getHalqaAttendanceRecords(halqaId) {
        return await APIGetArrayModel(this.halqaRecordsEndPoint(halqaId), HalqaAttendanceRecord);
    }

    static async includeHalqaStudentMissingRecords(halqaId) {
        return await APIPost(`${host}/api/halqa-attendance/halqa/${halqaId}/include-missing-student-records`);
    }

    /** 
     * @param {String} halqaId 
     * @returns {HalqaAttendanceSummary[]}
    */
    static async getHalqaAttendanceSummaries(halqaId) {
        return await APIGetArrayModel(`${host}/api/halqa-attendance/${halqaId}/attendance/summary/all`, HalqaAttendanceSummary);
    }

    /**
     * @param {string} halqaId 
     * @param {string} attendanceDayId 
     * @param {string|null} notes 
     */
    constructor(halqaId = '', attendanceDayId = '', notes = '') {
        super();

        this.halqaId = $state(halqaId);
        this.attendanceDayId = $state(attendanceDayId);
        this.attendanceDay = $state(null);
        this.notes = $state(notes);
    }

    includeMissingStudentRecords = async () => {
        return await APIPost(`${host}/api/halqa-attendance/${this.id}/include-missing-student-records`);
    }

    /** @returns {HalqaAttendanceSummary} */
    getSummary = async () => {
        let response = await APIGet(`${host}/api/halqa-attendance/${this.id}/summary`);
        if (response.succeed) {
            let instance = new HalqaAttendanceSummary();
            Object.assign(instance, response.data);
            return instance;
        } else {
            return null;
        }
    }
}

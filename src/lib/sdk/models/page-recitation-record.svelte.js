import { APIModel } from "../api-model.svelte";
import { APIGet } from "../api-request";
import { host } from "../host";

export class PageRecitationRecord extends APIModel {

    // API endpoints
    static getAllEndPoint() { return `${host}/api/page-recitation/all`; }
    static getEndPoint(id) { return `${host}/api/page-recitation/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/page-recitation/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/page-recitation/${id}`; }

    static availablePagesRecitationRecordsEndPoint(studentId) { return `${host}/api/page-recitation/student/${studentId}/accessible-recitation-records/all` }

    /**
     * @param {string} studentId 
     * @returns {Array<PageRecitationRecord>}
     */
    static async getStudentAvailablePageRecitationRecords(studentId) {
        let serverResponse = await APIGet(this.availablePagesRecitationRecordsEndPoint(studentId));
        if (serverResponse.succeed) {
            return serverResponse.data.map(item => {
                const instance = new this();
                Object.assign(instance, item);
                return instance;
            });
        }
        return [];
    }

    /**
     * @param {string} pageId
     * @param {string} studentAttendanceRecordId
     * @param {number} order
     * @param {Date|string|null} recordedAt
     */
    constructor(pageId = '', studentAttendanceRecordId = '', order = 0, recordedAt = null) {
        super(pageId); // assuming pageId acts as identifier

        this.pageId = $state(pageId);
        this.studentAttendanceRecordId = $state(studentAttendanceRecordId);
        this.order = $state(order);
        this.recordedAt = $state(recordedAt || new Date().toISOString());
    }
}
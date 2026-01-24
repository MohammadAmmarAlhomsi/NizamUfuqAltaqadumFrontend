import { APIModel } from "../api-model.svelte";
import { APIGet, APIGetArrayModel } from "../api-request";
import { host } from "../host";

export class PageRecitationRewardCancellationRecord extends APIModel {

    // API endpoints
    static getAllEndPoint() { return `${host}/api/page-recitation-reward-cancellation/all`; }
    static getEndPoint(id) { return `${host}/api/page-recitation-reward-cancellation/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/page-recitation-reward-cancellation/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/page-recitation-reward-cancellation/${id}`; }

    /**
     * @param {string} studentId 
     */
    static async getStudentAccessibleRecords(studentId) {
        return await APIGetArrayModel(`${host}/api/page-recitation-reward-cancellation/student/${studentId}/reward-cancellation-record/accessible/all`, PageRecitationRewardCancellationRecord);
    }

    constructor(pageRecitationRecordId = '') {
        super(); 

        this.pageRecitationRecordId = $state(pageRecitationRecordId);
    }
}
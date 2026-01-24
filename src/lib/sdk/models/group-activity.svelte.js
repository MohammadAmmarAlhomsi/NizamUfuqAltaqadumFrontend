import { APIModel } from "../api-model.svelte";
import { APIGetArrayModel } from "../api-request";
import { host } from "../host";
import { Student } from "./student.svelte";
import { AttendanceDay } from "./attendance-day.svelte";

/** 
 * @typedef StudentActivityWeight 
 * @property {String} studentId
 * @property {Number} weight
*/

export class GroupActivity extends APIModel {
    
    static getAllEndPoint() { return `${host}/api/group-activity/all`; }
    static getEndPoint(id) { return `${host}/api/group-activity/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/group-activity/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/group-activity/${id}`; }

    /** @param {String} halqaId */
    static async getHalqaGroupActivities(halqaId) {
        return await APIGetArrayModel(`${host}/api/group-activity/${halqaId}/all`, GroupActivity);
    }

    /**
     * @param {string} name 
     * @param {string} halqaId 
     * @param {string} attendanceDayId
     * @param {Array<StudentActivityWeight>} weights 
     * @param {string} notes 
     */
    constructor(name = '', attendanceDayId = '', halqaId = '', weights = [], notes = '') {
        super();

        /** @type {string} */
        this.name = $state(name);

        /** @type {string} */
        this.halqaId = $state(halqaId);

        /** @type {string} */
        this.attendanceDayId = $state(attendanceDayId);

        /** @type {Array<StudentActivityWeight>} */     
        this.weights = $state(weights);

        /** @type {AttendanceDay} */
        this.attendanceDay = $state(null);

        this.notes = $state(notes);
    }
}
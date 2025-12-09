import { APIModel } from "../api-model.svelte";
import { APIGetArray } from "../api-request";
import { host } from "../host";
import { Student } from "./student.svelte";

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
        return await APIGetArray(`${host}/api/group-activity/${halqaId}/all`, GroupActivity);
    }

    /**
     * @param {string} name 
     * @param {string} halqaId 
     * @param {string} happenedAt 
     * @param {Array<StudentActivityWeight>} weights 
     * @param {string} notes 
     */
    constructor(name = '', happenedAt = '', halqaId = '', weights = [], notes = '') {
        super();

        this.name = $state(name);
        this.halqaId = $state(halqaId);
        this.happenedAt = $state(happenedAt);

        /** @type {Array<StudentActivityWeight>} */     
        this.weights = $state(weights);

        this.notes = $state(notes);
    }
}
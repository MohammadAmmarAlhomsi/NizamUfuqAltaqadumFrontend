import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class JuzuAccess extends APIModel {

    static getAllEndPoint() { return `${host}/api/juzu-access/all`; }
    static getEndPoint(id) { return `${host}/api/juzu-access/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/juzu-access/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/juzu-access/${id}`; }

    /**
     * @param {number} juzuNumber
     * @param {string} studentId
     */
    constructor(juzuNumber = 0, studentId = '') {
        super(studentId);
        this.juzuNumber = $state(juzuNumber);
        this.studentId = $state(studentId);
    }
}

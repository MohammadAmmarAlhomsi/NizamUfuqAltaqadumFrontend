import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class JuzuAssessment extends APIModel {

    static getAllEndPoint() { return `${host}/api/juzu-assessment/all`; }
    static getEndPoint(id) { return `${host}/api/juzu-assessment/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/juzu-assessment/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/juzu-assessment/${id}`; }

    /**
     * @param {number} juzuNumber
     * @param {number} grade
     * @param {string} studentId
     * @param {string} notes
     */
    constructor(juzuNumber = 0, grade = 0, studentId = '', notes = '') {
        super(studentId);
        this.juzuNumber = $state(juzuNumber);
        this.grade = $state(grade);
        this.studentId = $state(studentId);
        this.notes = $state(notes);
    }
}
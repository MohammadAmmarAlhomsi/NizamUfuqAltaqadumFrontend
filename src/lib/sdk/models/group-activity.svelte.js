import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class StudentActivityWeight {
    constructor(
        studentId = '',
        weight = 0
    ) {
        this.studentId = studentId;
        this.weight = weight;
    }
}

export class GroupActivity extends APIModel {
    
    static getAllEndPoint() { return `${host}/api/group-activity/all`; }
    static getEndPoint(id) { return `${host}/api/group-activity/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/group-activity/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/group-activity/${id}`; }

    /**
     * 
     * @param {string} name 
     * @param {string} halqaId 
     * @param {string} date 
     * @param {Array<StudentActivityWeight>} weights 
     * @param {string} notes 
     */
    constructor(
        name = '',
        date = '',
        weights = [],
        notes = ''
    ) {
        super();

        this.name = $state(name);
        this.halqaId = $state(halqaId);
        this.date = $state(date);

        /** @type {Array<StudentActivityWeight>} */     
        this.weights = $state(weights);

        this.notes = $state(notes);
    }
}
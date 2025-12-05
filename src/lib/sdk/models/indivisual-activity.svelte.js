import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class IndividualActivity extends APIModel {
    
    static getAllEndPoint() { return `${host}/api/indivisual-activity/all`; }
    static getEndPoint(id) { return `${host}/api/indivisual-activity/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/indivisual-activity/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/indivisual-activity/${id}`; }

    constructor(
        name = '',
        studentId = '',
        notes = '', 
        weight = 0
    ) {
        super();

        this.name = $state(name);
        this.studentId = $state(studentId);
        this.notes = $state(notes);
        this.weight = $state(weight);
    }
}
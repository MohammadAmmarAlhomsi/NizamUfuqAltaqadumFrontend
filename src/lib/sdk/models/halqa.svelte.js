import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class Halqa extends APIModel {

    static getAllEndPoint() { return `${host}/api/halqa/all`; }
    static getEndPoint(id) { return `${host}/api/halqa/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/halqa/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/halqa/${id}`; }

    constructor(name = '', halqaDay = '', instructorId = '', notes = '') {
        super();

        this.name = $state(name);
        this.halqaDay = $state(halqaDay);
        this.instructorId = $state(instructorId);
        this.notes = $state(notes);
    }
}

import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class AttendanceDay extends APIModel {
    static getAllEndpoint() { return `${host}/api/attendance-day/all` }
    static getEndPoint(id) { return `${host}/api/attendance-day/${id}` }
    static upsertEndpoint(id) { return `${host}/api/attendance-day/${id}` }
    static deleteEndpoint(id) { return `${host}/api/attendance-day/${id}` }

    constructor(date, programTermId) {
        super();

        this.date = $state(date);
        this.programTermId = $state(programTermId);
    }
}
import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class AttendanceDay extends APIModel {
    static getAllEndPoint() { return `${host}/api/attendance-day/all` }
    static getEndPoint(id) { return `${host}/api/attendance-day/${id}` }
    static upsertEndPoint(id) { return `${host}/api/attendance-day/${id}` }
    static deleteEndPoint(id) { return `${host}/api/attendance-day/${id}` }

    constructor(date, programTermId) {
        super();

        this.date = $state(date);
        this.programTermId = $state(programTermId);
    }
}
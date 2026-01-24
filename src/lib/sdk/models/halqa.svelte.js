import { APIModel } from "../api-model.svelte";
import { APIGetArrayModel, APIGetArrayObject } from "../api-request";
import { host } from "../host";

/** @typedef {import("./student.svelte").StudentSummary} StudentSummary */

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

    /** @returns {StudentSummary[]} */
    getStudentsSummaries = async () => {
        return await APIGetArrayObject(`${host}/api/halqa/${this.id}/student/summary/all`)
    }
}

import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class QuranPage extends APIModel {

    static getAllEndPoint() { return `${host}/api/quran-page/all`; }
    static getEndPoint(id) { return `${host}/api/quran-page/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/quran-page/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/quran-page/${id}`; }

    constructor(
        number = null,
        juzuNumber = null
    ) {
        super();

        this.number = $state(number);
        this.juzuNumber = $state(juzuNumber);
    }
}
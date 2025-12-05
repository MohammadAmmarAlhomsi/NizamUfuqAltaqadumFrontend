import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class Instructor extends APIModel {

    static getAllEndPoint() { return `${host}/api/instructor/all`; }
    static getEndPoint(id) { return `${host}/api/instructor/${id}`; }
    static upsertEndPoint(id) { return `${host}/api/instructor/${id}`; }
    static deleteEndPoint(id) { return `${host}/api/instructor/${id}`; }

    constructor(
        username = '',
        email = '',
        password = '',
        fullName = '',
        phoneNumber = '',
        emirate = '',
        region = '',
        birthYear = null,
        notes = ''
    ) {
        super();

        this.username = $state(username);
        this.email = $state(email);
        this.password = $state(password);
        this.fullName = $state(fullName);
        this.phoneNumber = $state(phoneNumber);
        this.emirate = $state(emirate);
        this.region = $state(region);
        this.birthYear = $state(birthYear);
        this.notes = $state(notes);
    }
}

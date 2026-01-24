import { APIModel } from "../api-model.svelte";
import { host } from "../host";

export class Examiner extends APIModel {
    static getAllEndPoint() { return `${host}/api/examiner/all` }
    static getEndPoint(id) { return `${host}/api/examiner/${id}` }
    static upsertEndPoint(id) { return `${host}/api/examiner/${id}` }
    static deleteEndPoint(id) { return `${host}/api/examiner/${id}` }

    static getPairedExaminer = async () => {
        return await Examiner.get(`${host}/api/examiner/paired-examiner`);
    }

    constructor(username='', email='', password='', 
        fullName='', phoneNumber='', notes='', userId='') {

        super();

        /** @type {string} */ this.username = $state(username);
        /** @type {string} */ this.email = $state(email);
        /** @type {string} */ this.password = $state(password);
        /** @type {string} */ this.fullName = $state(fullName);
        /** @type {string} */ this.phoneNumber = $state(phoneNumber);
        /** @type {string} */ this.notes = $state(notes);
        /** @type {string} */ this.userId = $state(userId);
    }
}
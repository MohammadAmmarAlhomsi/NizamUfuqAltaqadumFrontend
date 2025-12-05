import { APIModel } from "../api-model.svelte";
import { APIGet, APIGetArray } from "../api-request";
import { host } from "../host";
import { PageRecitationRecord } from "./page-recitation-record.svelte";
import { QuranPage } from "./quran-page.svelte";

export class Student extends APIModel {
    
    static getAllEndPoint() { return `${host}/api/student/all` }
    static getEndPoint(id) { return `${host}/api/student/${id}` }
    static upsertEndPoint(id) { return `${host}/api/student/${id}` }
    static deleteEndPoint(id) { return `${host}/api/student/${id}` }
    static getHalqaStudentsEndPoint(halqaId) { return `${host}/api/student/halqa/${halqaId}/all` }

    /**
     * @param {string} halqaId 
     * @returns {Array<Student>}
     */
    static async loadHalqaStudents(halqaId) {
        return await APIGetArray(this.getHalqaStudentsEndPoint(halqaId), Student);
    }

    constructor(fullName = '',
        fatherName = '', motherName = '',
        birthYear = null, nationality = '', school = '',
        phoneNumber = '', fatherPhoneNumber = '', motherPhoneNumber = '',
        fatherWork = '', motherWork = '', halqaId = '',
        emirate = '', region = '', notes = ''
    ) {
        super();

        this.fullName = $state(fullName);
        this.fatherName = $state(fatherName);
        this.motherName = $state(motherName);
        this.birthYear = $state(birthYear);
        this.nationality = $state(nationality);
        this.school = $state(school);
        this.phoneNumber = $state(phoneNumber);
        this.fatherPhoneNumber = $state(fatherPhoneNumber);
        this.motherPhoneNumber = $state(motherPhoneNumber);
        this.fatherWork = $state(fatherWork);
        this.motherWork = $state(motherWork);
        this.halqaId = $state(halqaId);
        this.emirate = $state(emirate);
        this.region = $state(region);
        this.notes = $state(notes);
    }

    getAccessibleQuranPages = async () => {
        return await APIGetArray(`${host}/api/student/${this.id}/quran-page/accessible/all`, QuranPage)
    }

    getLastRecitationRecord = async () => {
        return await PageRecitationRecord.get(`${host}/api/page-recitation/student/${this.id}/accessible-recitation-records/last`);
    }
}
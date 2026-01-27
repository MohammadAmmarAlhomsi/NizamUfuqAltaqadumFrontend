import { APIModel } from "../api-model.svelte";
import { APIGet, APIGetArrayModel } from "../api-request";
import { host } from "../host";
import { PageRecitationRecord } from "./page-recitation-record.svelte";
import { QuranPage } from "./quran-page.svelte";
import { JuzuAssessment } from "./juzu-assessment.svelte";

/** 
 * @typedef StudentAttendanceDaySummary 
 * @property {string} attendanceStatus
 * @property {PageRecitationRecord[]} recitationRecords
 * @property {string} notes
*/

/**
 * @typedef {Object} StudentAttendanceSummary
 * @property {number} attendanceCount
 * @property {number} lateAttendanceCount
 * @property {number} abscentWithExecuseCount
 * @property {number} abscentWithoutExecuseCount
 * @property {number} totalPoints
 */

/**
 * @typedef {Object} StudentMemorizationSummary
 * @property {number} assessedAjzaCount
 * @property {number} recitedPagesCount
 * @property {number} totalJuzuAssessmentPoints
 * @property {number} totalRecitationPagePoints
 */

/**
 * @typedef {Object} StudentActivitySummary
 * @property {number} totalPoints
 */

/**
 * @typedef {Object} StudentSummary
 * @property {Student} student
 * @property {StudentAttendanceSummary} studentAttendanceSummary
 * @property {StudentMemorizationSummary} studentMemorizationSummary
 * @property {StudentActivitySummary} studentActivitySummary
 * @property {number} totalPoints
 */


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
        return await APIGetArrayModel(this.getHalqaStudentsEndPoint(halqaId), Student);
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
        return await APIGetArrayModel(`${host}/api/student/${this.id}/quran-page/accessible/all`, QuranPage)
    }

    getLastRecitationRecord = async () => {
        return await PageRecitationRecord.get(`${host}/api/page-recitation/student/${this.id}/accessible-recitation-records/last`);
    }

    /** @returns {StudentAttendanceDaySummary[]} */
    getAttendanceDaySummaries = async () => {
        let response = await APIGet(`${host}/api/student/${this.id}/attendance-days-summary`);
        if (response.succeed == true) {
            return response.data;
        } else {
            console.error(response.error);
            return [];
        }
    }

    /** @returns {StudentSummary} */
    getSummary = async () => {
        let response = await APIGet(`${host}/api/student/${this.id}/summary`);
        if (!response.succeed) return null;
        return response.data;
    }


    getAssessedAjza = async () => {
        return await APIGetArrayModel(`${host}/api/juzu-assessment/student/${this.id}/all`, JuzuAssessment)
    }
}
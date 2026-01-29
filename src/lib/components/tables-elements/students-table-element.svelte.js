import { BaseTableElement } from "../base-table/base-table.svelte";
import { Student } from "$lib/sdk/models/student.svelte";

/**
 * @template T 
 * @typedef {import "../base-table/base-table.svelte".TableElementHeader<T>} TableElementHeader<T> 
 */

/**
 * @template T
 * @typedef {import("../base-table/base-table.svelte").InstructionButton<T>} InstructionButton<T>
 */

export class StudentsTableElement extends BaseTableElement {

    /** @param {Student} student */
    constructor(student) {
        super();
        /** @type {Student} */
        this.student = $state(student);
    }

    /** @param {string | null | undefined} raw */
    static normalizePhoneNumber(raw) {
        if (!raw) return null;
        const digitsOnly = String(raw).replace(/\D/g, "");
        if (!digitsOnly) return null;
        return digitsOnly.replace(/^0+/, "");
    }

    /** @param {string | null | undefined} raw */
    static renderWhatsappLink(raw) {
        const normalized = StudentsTableElement.normalizePhoneNumber(raw);
        if (!normalized) return raw ?? "";
        const href = `https://wa.me/${normalized}`;
        const display = raw ?? "";
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${display}</a>`;
    }

    /** @returns {TableElementHeader<StudentsTableElement>[]} */
    static getHeaders() {
        return [
            { displayName: 'الاسم الكامل', render: e => e.student.fullName },
            { displayName: 'اسم الأب', render: e => e.student.fatherName },
            { displayName: 'اسم الأم', render: e => e.student.motherName },
            { displayName: 'الحلقة', render: e => e.student.halqaName },
            { displayName: 'سنة الميلاد', render: e => e.student.birthYear },
            { displayName: 'الجنسية', render: e => e.student.nationality },
            { displayName: 'المدرسة', render: e => e.student.school },
            { displayName: 'رقم الهاتف', render: e => StudentsTableElement.renderWhatsappLink(e.student.phoneNumber) },
            { displayName: 'رقم الأب', render: e => StudentsTableElement.renderWhatsappLink(e.student.fatherPhoneNumber) },
            { displayName: 'رقم الأم', render: e => StudentsTableElement.renderWhatsappLink(e.student.motherPhoneNumber) },
            { displayName: 'عمل الأب', render: e => e.student.fatherWork },
            { displayName: 'عمل الأم', render: e => e.student.motherWork },
            { displayName: 'الإمارة', render: e => e.student.emirate },
            { displayName: 'المنطقة', render: e => e.student.region  }
        ];
    }

    /** @type {InstructionButton<StudentsTableElement>} */
    static instructionButtons = [
        {
            getLabel: (element) => 'تعديل',
            onclick: (element) => {
                window.location.href = `/student/${element.student.id}/update`
            }
        },
        {
            getLabel: (element) => 'السجل',
            onclick: (element) => {
                window.location.href = `/student/${element.student.id}/record`

            }
        }
    ]
}

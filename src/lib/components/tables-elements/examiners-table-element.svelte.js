import { BaseTableElement } from "../base-table/base-table.svelte";
import { Examiner } from "$lib/sdk/models/examiner.svelte";

/**
 * @template T 
 * @typedef {import "../base-table/base-table.svelte".TableElementHeader<T>} TableElementHeader<T> 
 */

/**
 * @template T
 * @typedef {import("../base-table/base-table.svelte").InstructionButton<T>} InstructionButton<T>
 */

export class ExaminerTableElement extends BaseTableElement {

    /** @param {Examiner} examiner */
    constructor(examiner) {
        super();
        /** @type {Examiner} */
        this.examiner = $state(examiner);
    }

    /**
     * @returns {TableElementHeader<ExaminerTableElement>[]}
     */
    static getHeaders() {
        return [
            { displayName: "اسم المستخدم", render: e => e.examiner.username },
            { displayName: "الاسم الكامل", render: e => e.examiner.fullName },
            { displayName: "البريد الإلكتروني", render: e => e.examiner.email },
            { displayName: "رقم الهاتف", render: e => e.examiner.phoneNumber },
        ];
    }

    /** @type {InstructionButton<ExaminerTableElement>[]} */
    static instructionButtons = [
        {
            getLabel: () => 'تعديل',
            onclick: (element) => {
                window.location.href = `/examiner/${element.examiner.id}/update`;
            }
        }
    ];
}

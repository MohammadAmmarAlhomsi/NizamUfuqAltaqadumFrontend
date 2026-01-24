import { BaseTableElement } from "../base-table/base-table.svelte";
import { Instructor } from "$lib/sdk/models/instructor.svelte";

/**
 * @template T 
 * @typedef {import "../base-table/base-table.svelte".TableElementHeader<T>} TableElementHeader<T> 
 */

/**
 * @template T
 * @typedef {import("../base-table/base-table.svelte").InstructionButton<T>} InstructionButton<T>
 */

export class InstructorTableElement extends BaseTableElement {

    /** @param {Instructor} instructor */
    constructor(instructor) {
        super();
        /** @type {Instructor} */
        this.instructor = $state(instructor);
    }

    /** * @returns {TableElementHeader<InstructorTableElement>[]} */
    static getHeaders() {
        return [
            { displayName: "اسم المستخدم", render: e => e.instructor.username },
            { displayName: "الاسم الكامل", render: e => e.instructor.fullName },
            { displayName: "البريد الإلكتروني", render: e => e.instructor.email },
            { displayName: "رقم الهاتف", render: e => e.instructor.phoneNumber },
            { displayName: "الإمارة", render: e => e.instructor.emirate },
            { displayName: "منطقة السكن", render: e => e.instructor.region },
            { displayName: "سنة الميلاد", render: e => e.instructor.birthYear }
        ];
    }

    /** @type {InstructionButton<InstructorTableElement>[]} */
    static instructionButtons = [
        {
            getLabel: (element) => 'تعديل',
            onclick: (element) => {
                window.location.href = `/instructor/${element.instructor.id}/update`
            }
        },
    ]
}
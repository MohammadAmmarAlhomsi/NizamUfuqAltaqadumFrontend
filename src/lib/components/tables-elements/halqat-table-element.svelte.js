import { BaseTableElement } from "../base-table/base-table.svelte";
import { Halqa } from "$lib/sdk/models/halqa.svelte";

/**
 * @template T 
 * @typedef {import "../base-table/base-table.svelte".TableElementHeader<T>} TableElementHeader<T> 
 */

/**
 * @template T
 * @typedef {import("../base-table/base-table.svelte").InstructionButton<T>} InstructionButton<T>
 */

function translateDay(dayName) {
    if (dayName == 'Saturday') {
        return 'السبت'
    } else if (dayName == 'Sunday') {
        return 'الأحد'
    }

    return dayName;
}

export class HalqatTableElement extends BaseTableElement {

    /** @param {Halqa} halqa */
    constructor(halqa) {
        super();
        /** @type {Halqa} */
        this.halqa = $state(halqa);
    }

    /**
     * @returns {TableElementHeader<HalqatTableElement>[]}
     */
    static getHeaders() {
        return [
            { displayName: "اسم الحلقة", render: e => e.halqa.name },
            { displayName: "اسم الأستاذ", render: e => e.halqa.instructorName },
            { displayName: "اليوم", render: e => translateDay(e.halqa.halqaDay) },
            { displayName: "عدد الطلاب", render: e => e.halqa.students.length }
        ];
    }

    /** @type {InstructionButton<HalqatTableElement>[]} */
    static instructionButtons = [
        {
            getLabel: () => 'تعديل',
            onclick: (element) => {
                window.location.href = `/halqa/${element.halqa.id}/update`;
            }
        }
    ];
}

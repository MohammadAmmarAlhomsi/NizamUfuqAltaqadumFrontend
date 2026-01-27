import { BaseTableElement } from "../base-table/base-table.svelte";
import { JuzuAssessment } from "$lib/sdk/models/juzu-assessment.svelte";

/**
 * @template T 
 * @typedef {import("../base-table/base-table.svelte").TableElementHeader<T>} TableElementHeader<T>
 */

export class JuzuAssessmentTableElement extends BaseTableElement {

    /**
     * @param {JuzuAssessment} assessment
     */
    constructor(assessment) {
        super();

        /** @type {JuzuAssessment} */
        this.assessment = $state(assessment);
    }

    /**
     * @returns {TableElementHeader<JuzuAssessmentTableElement>[]}
     */
    static getHeaders() {
        return [
            {
                displayName: "الجزء",
                render: e => `الجزء ${e.assessment.juzuNumber}`
            },
            {
                displayName: "الدرجة",
                render: e => e.assessment.grade
            },
            // {
            //     displayName: "ملاحظات",
            //     render: e => e.assessment.notes || "-"
            // }
        ];
    }
}

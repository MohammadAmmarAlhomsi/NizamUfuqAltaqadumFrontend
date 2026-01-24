/** @typedef {import("$lib/sdk/models/student.svelte").StudentSummary} StudentSummary*/

export class StudentsSummariesTable {

    constructor() {
        /** @type {StudentSummary[]} */
        this.summaries = $state([]);
    }

    onMount = () => {
        
    }

    /** @param {StudentSummary} summary */
    handleClickSummary = (summary) => {
        window.location.href = `/student/${summary.student.id}/record`
    }
}
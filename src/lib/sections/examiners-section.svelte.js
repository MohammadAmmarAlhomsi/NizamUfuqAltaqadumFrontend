import { TableSection } from "./table-section.svelte";
import { ExaminerTableElement } from "$lib/components/tables-elements/examiners-table-element.svelte";
import { Examiner } from "$lib/sdk/models/examiner.svelte";

/** @extends {TableSection<ExaminerTableElement>} */
export class ExaminersSection extends TableSection {

    constructor() {
        super(ExaminerTableElement);
    }

    loadElements = async () => {
        const examiners = await Examiner.getAll();
        this.table.elements = examiners.map(
            ex => new ExaminerTableElement(ex)
        );
    }

    createNew = async () => {
        window.location.href = `/examiner/create`
    }
}

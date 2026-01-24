import { TableSection } from "./table-section.svelte";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { StudentsSummariesTable } from "$lib/components/students-summaries-table/students-summaries-table.svelte";

import StudentsSummariesTableRenderer from "$lib/components/students-summaries-table/students-summaries-table-renderer.svelte";

export class InstructorsSection extends TableSection {

    constructor() {
        super(null);

        this.Renderer = StudentsSummariesTableRenderer
        this.table = new StudentsSummariesTable();
    }

    loadElements = async () => {
        let instructors = await Instructor.getAll();
        this.table.elements = instructors.map(ins => new InstructorTableElement(ins));
    }

    createNew = async () => {
        // window.location.href = `/instructor/create`
    }
}
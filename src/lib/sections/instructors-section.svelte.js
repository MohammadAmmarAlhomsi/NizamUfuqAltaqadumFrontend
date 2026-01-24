import { TableSection } from "./table-section.svelte";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { InstructorTableElement } from "$lib/components/tables-elements/instructors-table-element.svelte";
import { Instructor } from "$lib/sdk/models/instructor.svelte";

/** @extends {TableSection<InstructorTableElement>} */
export class InstructorsSection extends TableSection {

    constructor() {
        super(InstructorTableElement);
    }

    loadElements = async () => {
        let instructors = await Instructor.getAll();
        this.table.elements = instructors.map(ins => new InstructorTableElement(ins));
    }

    createNew = async () => {
        window.location.href = `/instructor/create`
    }
}
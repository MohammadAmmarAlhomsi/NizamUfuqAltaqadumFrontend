import { TableSection } from "./table-section.svelte";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { StudentsTableElement } from "$lib/components/tables-elements/students-table-element.svelte";
import { Student } from "$lib/sdk/models/student.svelte";

/** @extends {TableSection<StudentsTableElement>} */
export class StudentsSection extends TableSection {

    constructor() {
        super(StudentsTableElement);
    }

    loadElements = async () => {
        let students = await Student.getAll();
        this.table.elements = students.map(s => new StudentsTableElement(s));
    }

    createNew = async () => {
        window.location.href = `/student/create`
    }
}
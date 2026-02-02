import { TableSection } from "./table-section.svelte";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { StudentsTableElement } from "$lib/components/tables-elements/students-table-element.svelte";
import { Student } from "$lib/sdk/models/student.svelte";

/** @extends {TableSection<StudentsTableElement>} */
export class StudentsSection extends TableSection {

    constructor() {
        super(StudentsTableElement);
        this.table.isRowClickable = true;
    }

    loadElements = async () => {
        let students = await Student.getAll();
        this.table.elements = students.map(s => new StudentsTableElement(s));
        this.table.addEventListener('clickRow', (e) => {
            window.location.href = `/student/${e.detail.element.student.id}/record`      
        })
    }

    createNew = async () => {
        window.location.href = `/student/create`
    }
}
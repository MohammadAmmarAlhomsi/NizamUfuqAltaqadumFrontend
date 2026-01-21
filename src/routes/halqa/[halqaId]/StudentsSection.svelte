<script>
    import StudentsTable from "$lib/components/tables/StudentsTable.svelte";
    import { StudentsTableElement } from "$lib/components/students-table/students-table-element.svelte";
    import { BaseTable } from "$lib/components/base-table/base-table.svelte";
    
    import { Student } from "$lib/sdk/models/student.svelte";
    import { onMount } from "svelte";

    import TableRenderer from "$lib/components/base-table/table-renderer.svelte";

    let { halqa = $bindable(null) } = $props();

    let table = new BaseTable(StudentsTableElement);

    $effect(async () => {
        table.showOrderColumn = true;
        let students = await Student.loadHalqaStudents(halqa.id);
        table.elements = students.map(s => new StudentsTableElement(s));
    })

    async function retrieveHalqaStudents() {
        return await Student.loadHalqaStudents(halqa.id);
    }
</script>

{#if halqa != null}
    <div class="vertical-center">
        <h1 style="margin-bottom: 20px;">طلاب الحلقة</h1>
        <div class="container">
            <!-- <StudentsTable loadStudents={retrieveHalqaStudents} /> -->
            <TableRenderer source={table}/>
        </div> 
    </div>
{/if}
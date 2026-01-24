<script>
    import StudentsTable from "$lib/components/tables/StudentsTable.svelte";
    import { StudentsTableElement } from "$lib/components/tables-elements/students-table-element.svelte";
    import { BaseTable } from "$lib/components/base-table/base-table.svelte";
    
    import { Student } from "$lib/sdk/models/student.svelte";
    import { onMount } from "svelte";

    import TableRenderer from "$lib/components/base-table/table-renderer.svelte";

    let { halqa = $bindable(null) } = $props();

    let table = new BaseTable(StudentsTableElement);

    $effect(async () => {
        if (halqa == null) return;
        
        let students = await Student.loadHalqaStudents(halqa.id);
        table.elements = students.map(s => new StudentsTableElement(s));
    })

    async function retrieveHalqaStudents() {
        return await Student.loadHalqaStudents(halqa.id);
    }
</script>

{#if halqa != null}
    <div class="vertical-center">
        <div class="width: calc(100% - 50px)">
            <!-- <StudentsTable loadStudents={retrieveHalqaStudents} /> -->
            <TableRenderer source={table}/>
        </div> 
    </div>
{/if}
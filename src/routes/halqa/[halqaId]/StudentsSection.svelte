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
        table.isRowClickable = true;
        table.addEventListener('clickRow', e => {
            window.location.href = `/student/${e.detail.element.student.id}/record`
        });
    })

    async function retrieveHalqaStudents() {
        return await Student.loadHalqaStudents(halqa.id);
    }
</script>

{#if halqa != null}
    <div class="students-section">
        <div class="table-wrapper">
            <!-- <StudentsTable loadStudents={retrieveHalqaStudents} /> -->
            <TableRenderer source={table}/>
        </div> 
    </div>
{/if}

<style>
    .students-section {
        width: 100%;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
    }

    .table-wrapper {
        width: 100%;
        max-width: 100vw;
        padding: 0 16px;
        box-sizing: border-box;
        margin-top: 16px;
    }

    @media (max-width: 900px) {
        .table-wrapper {
            margin-top: 48px;
        }
    }
</style>

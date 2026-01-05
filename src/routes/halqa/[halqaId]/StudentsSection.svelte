<script>
    import StudentsTable from "$lib/components/tables/StudentsTable.svelte";

    import { Student } from "$lib/sdk/models/student.svelte";
    import { onMount } from "svelte";

    let { halqa = $bindable(null) } = $props();

    async function retrieveHalqaStudents() {
        return await Student.loadHalqaStudents(halqa.id);
    }
</script>

{#if halqa != null}
    <div class="vertical-center students-wrap">
        <h1 class="students-title">طلاب الحلقة</h1>
        <div class="table-scroll">
            <StudentsTable loadStudents={retrieveHalqaStudents} />
        </div> 
    </div>
{/if}

<style>
    .students-wrap {
        width: 100%;
        max-width: 100%;
        padding: 0 12px;
        box-sizing: border-box;
        align-items: stretch;
        gap: 12px;
    }

    .students-title {
        margin: 0;
        margin-bottom: 8px;
        text-align: center;
        font-size: 1.4rem;
    }

    .table-scroll {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>

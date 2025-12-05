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
    <div class="vertical-center">
        <h1 style="margin-bottom: 20px;">طلاب الحلقة</h1>
        <div class="container">
            <StudentsTable loadStudents={retrieveHalqaStudents} />
        </div> 
    </div>
{/if}

<style>

</style>
<script>
    import { page } from "$app/state";
    import { Halqa } from "$lib/sdk/models/halqa.svelte";
    import { Student } from "$lib/sdk/models/student.svelte";
    import { onMount } from "svelte";

    import { StudentsSummariesTable } from "$lib/components/students-summaries-table/students-summaries-table.svelte";
    
    import StudentsSummariesTableRenderer from "$lib/components/students-summaries-table/students-summaries-table-renderer.svelte";
    
    let halqaId = $state(page.params.halqaId);

    /** @type {Halqa} */
    let halqa = $state(null);

    /** @type {string} */
    let text = $state('');

    let summariesTable = new StudentsSummariesTable();

    onMount(async () => {
        halqa = await Halqa.getById(halqaId);

        let students = await Student.loadHalqaStudents(halqa.id);
        let summaries = await halqa.getStudentsSummaries();

        summariesTable.summaries = summaries;

        console.log(summaries);

        // let summary = await student.getSummary();
        // console.log(summary);
    })
</script>

<main>
    {#if halqa != null}
        <StudentsSummariesTableRenderer source={summariesTable}/>
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;
    }
     
    p {
        text-align: center;
    }
</style>
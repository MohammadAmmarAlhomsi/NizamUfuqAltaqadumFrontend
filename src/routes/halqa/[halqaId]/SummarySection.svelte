<script>
    import { Halqa } from "$lib/sdk/models/halqa.svelte";
    import { StudentsSummariesTable } from "$lib/components/students-summaries-table/students-summaries-table.svelte";
    import { onMount } from "svelte";

    import StudentsSummariesTableRenderer from "$lib/components/students-summaries-table/students-summaries-table-renderer.svelte";

    /** @type {{ halqaId: string }}*/
    let { halqaId = null } = $props();
    
    let summariesTable = $state(new StudentsSummariesTable());

    $effect(async () => {
        if (halqaId == null) return;

        let halqa = await Halqa.getById(halqaId);

        summariesTable.summaries = await halqa.getStudentsSummaries();
    });
</script>

<div class="container">
    <StudentsSummariesTableRenderer source={summariesTable}/>
</div>

<style>
    .container {
        width: calc(100% - 40px);
    }
</style>
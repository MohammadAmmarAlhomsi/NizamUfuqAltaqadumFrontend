<script>
    import { Halqa } from "$lib/sdk/models/halqa.svelte";
    import { StudentsSummariesTable } from "$lib/components/students-summaries-table/students-summaries-table.svelte";
    import { onMount } from "svelte";

    import StudentsSummariesTableRenderer from "$lib/components/students-summaries-table/students-summaries-table-renderer.svelte";
    import Button from "$lib/components/Button.svelte";

    import { exportSummaryExcel } from "../../../utilities/export-excel.js";

    /** @type {{ halqaId: string }}*/
    let { halqaId = null } = $props();
    
    let summariesTable = $state(new StudentsSummariesTable());
    let halqaName = $state('');

    $effect(async () => {
        if (halqaId == null) return;

        let halqa = await Halqa.getById(halqaId);
        halqaName = halqa?.name || '';
        summariesTable.summaries = await halqa.getStudentsSummaries();
    });

    function handleExportExcel() {
        exportSummaryExcel(summariesTable?.summaries || [], halqaName);
    }
</script>

<div class="container">
    <div class="actions">
        <Button onclick={handleExportExcel}>تصدير Excel</Button>
    </div>
    <StudentsSummariesTableRenderer source={summariesTable}/>
</div>

<style>
    .container {
        width: calc(100% - 40px);
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 12px;
    }
</style>

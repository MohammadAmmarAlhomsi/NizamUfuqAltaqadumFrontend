<script>
    import styles from './follow-up-section.module.css'

    import Button from '$lib/components/Button.svelte';
    import BaseHalqaRecordInitiatorForm from '$lib/components/forms/BaseHalqaRecordInitiatorForm.svelte';
    import HalqaAttendanceSummaryCellRenderer from '../halqa-attendance-summary-cell/halqa-attendance-summary-cell-renderer.svelte';
    import dayjs from "dayjs";

    import { registerHalqaAttendance, fetchAllHalqaAttendances } from '$lib/sdk/halqa';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { StudentAttendanceRecord } from '$lib/sdk/models/student-attendance-record.svelte';
    import { HalqaAttendanceRecord } from '$lib/sdk/models/halqa-attendance-record.svelte';
    import { FollowUpSection } from './follow-up-section.svelte';

    /** @type {{source: FollowUpSection}} */
    let { source, halqa, attendancesRecords = [] } = $props();

    onMount(async () => {
        await source.onMount();
    });
</script>

<div class={styles["container"]}>
    <Button onclick={source.handleOpenForm}>تسجيل يوم جديد</Button>

    <div style="height: 30px;"></div>

    <div class={styles["attendance-days-container"]}>
        {#each source.halqaAttendanceCells as attendanceCell, i}
            <HalqaAttendanceSummaryCellRenderer 
                bind:source={source.halqaAttendanceCells[i]} 
                />
        {/each}
    </div>

    {#if source.showBaseHalqaInitiatior}
        <div class={styles["overlay"]}>
            <BaseHalqaRecordInitiatorForm 
                onSubmit={source.handleCreateHalqaAttendance}
                onCancel={source.handleCloseForm} 
                bind:halqa={source.halqa}/>
        </div>
    {/if}
</div>

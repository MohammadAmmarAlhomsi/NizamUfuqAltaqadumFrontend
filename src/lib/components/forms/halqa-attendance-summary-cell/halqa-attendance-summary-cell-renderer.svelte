<script>
    import styles from './halqa-attendance-summary-cell.module.css'

    import { stopPropagation } from "svelte/legacy";
    import { HalqaAttendanceSummaryCell } from './halqa-attendance-summary-cell.svelte';
    import { onMount } from "svelte";

    import Button from '$lib/components/Button.svelte';

    /** @type {{source: HalqaAttendanceSummaryCell}} */
    let { source = $bindable(null) } = $props();

    onMount(async () => {
        await source.onMount();
    })
</script>

<div
    tabindex="0"
    role="button"
    onkeydown={(_) => {}}
    onclick={source.handleClick}
    class={styles['container']}
    >
    <p>حضور {source.dayName} {source.dateFormatted} </p>

    <div style="height: 10px;"></div>
    
    <div class={styles['stats-container']}>
        {#if source.summary != null}
            <div class={[styles['line'], styles['Attended']]}><span></span>الحضور: {source.summary.attendedCount}</div>
            <div class={[styles['line'], styles['AttendedLate']]}><span></span>الحضور المتأخر: {source.summary.attendedLateCount}</div>
            <div class={[styles['line'], styles['AbscentWithExecuse']]}><span></span>الغياب بعذر: {source.summary.abscentWithExecuseCount}</div>
            <div class={[styles['line'], styles['AbscentWithoutExecuse']]}><span></span>الغياب بدون عذر: {source.summary.abscentWithoutExecuseCount}</div>
            <div class={[styles['line'], styles['Default']]}><span></span>بدون تحديد: {source.summary.attendedLateCount}</div>
        {/if}
    </div>

    <div style="height: 10px"></div>

    <div class={styles['footer-container']}>
        <p class={styles['notes-label']}>الملاحظات: </p>
        <p>{source.halqaAttendanceRecord.notes == '' ? 
             '------------------' : 
             source.halqaAttendanceRecord.notes}</p>
    </div>
</div>
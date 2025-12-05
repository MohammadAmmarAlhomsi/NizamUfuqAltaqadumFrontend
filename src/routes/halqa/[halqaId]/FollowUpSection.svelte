<script>
    import Button from '$lib/components/Button.svelte';
    import BaseHalqaRecordInitiatorForm from '$lib/components/forms/BaseHalqaRecordInitiatorForm.svelte';
    import HalqaAttendanceSummaryCell from '$lib/components/HalqaAttendanceSummaryCell.svelte';
    import dayjs from "dayjs";

    import { registerHalqaAttendance, fetchAllHalqaAttendances } from '$lib/sdk/halqa';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { StudentAttendanceRecord } from '$lib/sdk/models/student-attendance-record.svelte';
    import { HalqaAttendanceRecord } from '$lib/sdk/models/halqa-attendance-record.svelte';

    let { halqa, attendancesRecords = [] } = $props();

    let showBaseHalqaInitiator = $state(false);

    /** * @type {Array<HalqaAttendanceRecord>} */
    let records = $state([]);

    function handleOpenForm() {
        showBaseHalqaInitiator = true;
    }

    function handleCloseForm() {
        showBaseHalqaInitiator = false;
    }

    async function handleSubmit(day) {
        let halqaAttendanceRecord = new HalqaAttendanceRecord(halqa.id, day.id, '');
        let response = await halqaAttendanceRecord.save();
        if (response.succeed == false) { 
            alert('حدث خطأ أثناء إنشاء سجل الحلقة'); 
        } else {
            await fetchRecords();
        }

        handleCloseForm();
    }

    async function fetchRecords() {
        records = await HalqaAttendanceRecord.getHalqaAttendanceRecords(halqa.id);
        await HalqaAttendanceRecord.includeHalqaStudentMissingRecords(halqa.id);
    }

    $effect(async () => {
        if (halqa != null) {
            await fetchRecords();
        }
    });
</script>

<div class="container">
    <Button onclick={handleOpenForm}>تسجيل يوم جديد</Button>

    <div style="height: 30px;"></div>

    <div class="attendance-days-container">
        {#each records as attendanceRecord, i}
            <HalqaAttendanceSummaryCell
                {attendanceRecord}
                index={i}
            />
        {/each}
    </div>

    {#if showBaseHalqaInitiator}
        <div class="overlay">
            <BaseHalqaRecordInitiatorForm 
                onSubmit={handleSubmit}
                onCancel={handleCloseForm} 
                bind:halqa={halqa}/>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80%;
    }

    .attendance-days-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 220px));
            justify-content: center;
            gap: 30px;
            width: 80%;
        }

    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0; top: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

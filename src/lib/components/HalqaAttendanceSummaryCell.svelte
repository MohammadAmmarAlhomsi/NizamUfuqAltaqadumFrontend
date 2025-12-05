<script>
    import dayjs from "dayjs";
    import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
    import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";
    import { onMount } from "svelte";

    /** @type {{attendanceRecord: HalqaAttendanceRecord, index: number}} */
    let { attendanceRecord: halqaAttendanceRecord, index, onclick = () => { } } = $props();

    /** @type {StudentAttendanceRecord[]}*/
    let studentsAttendanceRecords = $state([]);

    onMount(async () => {
        await loadStudentAttendances();
    })

    async function loadStudentAttendances() {
        studentsAttendanceRecords = await StudentAttendanceRecord.getHalqaAttendanceStudentAttendanceRecords(halqaAttendanceRecord.id);
    }

    function handleClick() {
        window.location.href = `/halqa/${halqaAttendanceRecord.halqaId}/attendance/${halqaAttendanceRecord.id}`;
        onclick(halqaAttendanceRecord);
    }

    const countByStatus = (status) => 
        studentsAttendanceRecords.filter(s => s.status === status).length;

    const countUndefined = () => 
        studentsAttendanceRecords.filter(s => !s.status).length;
</script>

<button 
    onclick={handleClick} 
    class:last-day={index === 0}
    class="attendance-day-button"
>
    <p>حضور {dayjs(halqaAttendanceRecord.attendanceDay.date).format("dddd DD/MM/YYYY")}</p>

    <div style="height: 10px;"></div>

    <div class="detailed-attendance-record">
        <p class="green-text">
            <span class="color-box green"></span> 
            الحضور: {countByStatus('Attended')}
        </p>
        <p class="green-dark-text">
            <span class="color-box green-dark"></span> 
            الحضور المتأخر: {countByStatus('AttendedLate')}
        </p>
        <p class="yellow-text">
            <span class="color-box yellow"></span>  
            الغياب بعذر: {countByStatus('AbscentWithExecuse')}
        </p>
        <p class="red-text">
            <span class="color-box red"></span> 
            الغياب بدون بعذر: {countByStatus('AbscentWithoutExecuse')}
        </p>
        <p class="white-text">
            <span class="color-box white"></span> 
            بدون تحديد: {countUndefined()}
        </p>
    </div>
    
    <p style="text-align: start; margin-top: 5px"><b>الملاحظات:</b></p>
    {#if halqaAttendanceRecord.notes}
        <p style="text-align: start;">{halqaAttendanceRecord.notes}</p>
    {:else}
        <p>-----------------</p>
    {/if}
</button>

<style>
    .last-day { transform: scale(1.075); transition: transform 0.2s ease; }
    .color-box { width: 12px; height: 12px; border-radius: 2px; display: inline-block; margin-inline-end: 10px; }
    .color-box.red { background-color: #e74c3c; }
    .color-box.yellow { background-color: #f1c40f; }
    .color-box.green { background-color: #27ae60; }
    .color-box.green-dark { background-color: rgb(183, 231, 192); }
    .color-box.white { background: white; box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2); }

    .red-text { color: #e74c3c; }
    .yellow-text { color: #f1c40f; }
    .green-text { color: #27ae60; }
    .green-dark-text { color: rgb(162, 224, 174); }

    .detailed-attendance-record { text-align: start; }
    .attendance-day-button { 
        padding: 15px; 
        background: white; 
        box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.2); 
        border-radius: 15px; 
        border: none; 
        outline: none; 
        margin-bottom: 15px; 
        cursor: pointer; 
    }
</style>
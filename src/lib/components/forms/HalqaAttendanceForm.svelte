<script>
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import DropdownField from "../DropdownField.svelte";
    import StudentAttendanceCell from "./StudentAttendanceCell.svelte";
    import NotesForm from "./NotesForm.svelte";

    import { page } from "$app/state";
    import { fetchHalqaById, updateHalqaAsync, updateStudentAttendance } from "$lib/sdk/halqa";
    import { onMount } from "svelte";
    import { updateHalqaAttendance } from "$lib/sdk/halqa-attendance-record";
    
    import dayjs from 'dayjs';
    import 'dayjs/locale/ar';

    dayjs.locale('ar');

    let {
        date = new Date(), 
        halqa = $bindable(null),
        halqaAttendance = $bindable(null),
        ...props 
    } = $props();

    let students = $state([]);
    let attendanceValue = $state('');
    let notesSelectedStudentAttendanceRecordIdx = $state(-1);

    let showNotesMenu = $state(false);

    $effect(() => {
        if (halqa != null) {
            students = halqa?.students;

            console.log('halqa:');
            console.log($state.snapshot(halqa));
        }


    })

    $effect(() => {
        if (halqaAttendance != null) {
            console.log('halqa attendance record:');
            console.log($state.snapshot(halqaAttendance));
        }
    });

    onMount(() => {
        if (halqa != null) {
            students = halqa.students;
        }    
    })

    async function handleSaveStudentAttendanceNotes(notes) {
        halqaAttendance.studentsAttendanceRecords[notesSelectedStudentAttendanceRecordIdx].notes = notes;
        
        let studentAttendanceRecord = halqaAttendance.studentsAttendanceRecords[notesSelectedStudentAttendanceRecordIdx];
        await saveStudentRecord(studentAttendanceRecord);

        notesSelectedStudentAttendanceRecordIdx = -1;
        showNotesMenu = false;
    }

    async function saveStudentRecord(studentAttendanceRecord) {
        try {
            let { id, ...dto } = studentAttendanceRecord;
            await updateStudentAttendance(studentAttendanceRecord.id, dto);
            console.log('saved student attendance record:');
        } catch (e) {
            alert('حدث خطأ أثناء حفظ حالة حضور الطالب.');
            console.error(e);
        }
    }

    function handleCancelNotesTyping() {
        notesSelectedStudentAttendanceRecordIdx = -1;
        showNotesMenu = false;
    }

    function handleClickNotes(studentAttendanceRecordIdx) {
        notesSelectedStudentAttendanceRecordIdx = studentAttendanceRecordIdx;
        showNotesMenu = true
    }

    function handleClick(studentAttendanceRecord) {
        window.location.href = `/halqa/${halqa.id}/attendance/${halqaAttendance.id}/student-attendance/${studentAttendanceRecord.id}`;
    }

    async function handleStudentAttendanceChange(studentAttendanceRecord, newValue) {
        await saveStudentRecord(studentAttendanceRecord);
        if (studentAttendanceRecord.status == 'Attended') {
            // window.location.href = `/halqa/${halqa.id}/attendance/${halqaAttendance.id}/student-attendance/${studentAttendanceRecord.id}`;
        } else if (studentAttendanceRecord.status == 'AbscentWithExecuse') {
            notesSelectedStudentAttendanceRecordIdx = halqaAttendance.studentsAttendanceRecords.findIndex(record => record.id == studentAttendanceRecord.id);
            showNotesMenu = true;
        }
    }

    async function handleSubmit() {
        try {
            let dto = { attendanceDayId: halqaAttendance.attendanceDayId, notes: halqaAttendance.notes };
            await updateHalqaAttendance(halqaAttendance.id, dto);
            window.location.href = `/halqa/${halqa.id}?tabIdx=1`;
        } catch (e) { 
            alert('حدث خطأ أثناء تنزيل الحلقة');
            console.error(e);
        }
    }
</script>

<div class='container'>
    <div style="height: 20px;"></div>

    <div class="students-container">
        {#if halqa == null || halqa.students.length == 0}
            <p>لا يوجد طلاب</p>
        {:else if halqaAttendance != null}
            {#each halqaAttendance.studentsAttendanceRecords as attendanceRecord, i}
                <StudentAttendanceCell 
                    onclick={handleClick} 
                    onchange={async () => await handleStudentAttendanceChange(halqaAttendance.studentsAttendanceRecords[i], attendanceValue)}
                    onclickNotesIcon= { () => handleClickNotes(i) }
                    bind:studentAttendanceRecord={halqaAttendance.studentsAttendanceRecords[i]}/>
            {/each}
        {/if}
    </div>

    <div style="height: 50px;"></div>
    <div style="height: 100px;">
        {#if halqaAttendance != null}
            <TextAreaField bind:value={halqaAttendance.notes} label="ملاحظات"></TextAreaField>
        {/if}
    </div>

    <div style="height: 20px;"></div>

    <div class="submit-button-container">
        <Button onclick={handleSubmit}>حفظ</Button>
    </div>

    <div style="height: 50px;"></div>
</div>

{#if showNotesMenu}
    <NotesForm
        startingNotes={halqaAttendance.studentsAttendanceRecords[notesSelectedStudentAttendanceRecordIdx]?.notes} 
        student={halqaAttendance.studentsAttendanceRecords[notesSelectedStudentAttendanceRecordIdx]?.student}
        onclickCancel = {handleCancelNotesTyping}
        onclickSave = {handleSaveStudentAttendanceNotes}
    />
{/if}

<style>
    .container {
        text-align: center;
        width: 80%;
    }

    .students-container {
        margin-top: 150px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 0.5fr));
        gap: 25px;
        text-align: center;

        justify-content: center;
    }

    .submit-button-container {
        display: flex;
        align-items: end;
        justify-content: end;
        width: 100%;
    }
</style>
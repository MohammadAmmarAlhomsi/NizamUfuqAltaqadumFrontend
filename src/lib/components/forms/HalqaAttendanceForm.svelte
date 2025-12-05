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
    import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
    import { Halqa } from "$lib/sdk/models/halqa.svelte";
    import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";
    
    import dayjs from 'dayjs';
    import 'dayjs/locale/ar';
    import { Student } from "$lib/sdk/models/student.svelte";

    dayjs.locale('ar');

    /**
     * @type {{halqaAttendanceId: string, halqa: Halqa, date:str}}
     */
    let {
        halqa = $bindable(null),
        halqaAttendanceId = $bindable(''),
        ...props 
    } = $props();

    /** @type {Array<Student>}*/
    let students = $state([]);

    /** @type {Array<StudentAttendanceRecord>}*/
    let studentAttendances = $state([]);

    /** @type {HalqaAttendanceRecord}*/
    let halqaAttendance = $state(null);

    let attendanceValue = $state('');

    /** @type {StudentAttendanceRecord} */
    let selectedNotesRecord = $state(null);

    $effect(async () => {
        if (halqa != null) {
            students = await Student.loadHalqaStudents(halqa.id);
        }
    });

    $effect(async () => {
        if (halqa != null && halqaAttendanceId != '') {
            halqaAttendance = await HalqaAttendanceRecord.getById(halqaAttendanceId);
        }
    });

    $effect(async () => { await loadStudentAttendances(); });
    
    async function loadStudentAttendances() {
        if (halqaAttendance != null) {
            studentAttendances = await StudentAttendanceRecord.getHalqaAttendanceStudentAttendanceRecords(halqaAttendance.id);
        }
    }

    async function handleSaveStudentAttendanceNotes(notes) {
        if (selectedNotesRecord == null) return;
        
        selectedNotesRecord.notes = notes;

        console.log(selectedNotesRecord);

        let response = await selectedNotesRecord.save();
        console.log(response);

        await loadStudentAttendances();

        selectedNotesRecord = null;
    }

    /**
     * @param {StudentAttendanceRecord} studentAttendanceRecord
     */
    async function saveStudentRecord(studentAttendanceRecord) {
        await studentAttendanceRecord.save();
    }

    function handleCancelNotesTyping() {
        selectedNotesRecord = null;
    }

    function handleClick(studentAttendanceRecord) {
        window.location.href = `/halqa/${halqa.id}/attendance/${halqaAttendance.id}/student-attendance/${studentAttendanceRecord.id}`;
    }

    /**
     * @param {StudentAttendanceRecord} studentAttendanceRecord
     */
    async function handleStudentAttendanceChange(studentAttendanceRecord, newValue) {
        if (studentAttendanceRecord.status == 'AbscentWithExecuse') {
            selectedNotesRecord = studentAttendances.find(record => record.id == studentAttendanceRecord.id);
        } else {
            console.log(studentAttendanceRecord)
            await studentAttendanceRecord.save();
            // await loadStudentAttendances();
        }
    }

    async function handleSubmit() {
        let response = await halqaAttendance.save();
        if (response.succeed == false) {
            alert('حدث خطأ أثناء حفظ حضور الحلقة.');
            return;
        }
        window.location.href = `/halqa/${halqa.id}?tabIdx=1`;
    }
</script>

<div class='container'>
    <div style="height: 20px;"></div>

    <div class="students-container">
        {#if students.length == 0}
            <p>لا يوجد طلاب</p>
        {:else if halqaAttendance != null}
            {#each studentAttendances as attendanceRecord, i}
                <StudentAttendanceCell 
                    onclick={handleClick} 
                    onchange={async () => await handleStudentAttendanceChange(studentAttendances[i], attendanceValue)}
                    onclickNotesIcon= { () => selectedNotesRecord = attendanceRecord }
                    bind:studentAttendanceRecord={studentAttendances[i]}/>
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

{#if selectedNotesRecord != null}
    <NotesForm
        startingNotes={selectedNotesRecord.notes} 
        student={selectedNotesRecord.student}
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
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
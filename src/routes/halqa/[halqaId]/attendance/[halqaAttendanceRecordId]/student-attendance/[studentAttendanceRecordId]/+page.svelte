<script>
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { fetchHalqaAttendanceRecord, fetchHalqaById, fetchStudentAttendanceRecord } from "$lib/sdk/halqa";
    import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";
    import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
    import { Halqa } from "$lib/sdk/models/halqa.svelte";

    import Header from "$lib/components/layout/Header.svelte";
    import HalqaAttendanceForm from "$lib/components/forms/HalqaAttendanceForm.svelte";
    import StudentAttendanceFormRenderer from "$lib/components/forms/student-attendance-form/StudentAttendanceFormRenderer.svelte";
    import Button from "$lib/components/Button.svelte";
    import PageCancellationWindow from "$lib/components/PageCancellationWindow.svelte";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    /** @type {Halqa} */
    let halqa = $state(null);

    /** @type {HalqaAttendanceRecord} */
    let halqaAttendanceRecord = $state(null);

    /** @type {StudentAttendanceRecord}*/
    let studentAttendanceRecord = $state(null);

    onMount(async () => {
        halqa = await Halqa.getById(page.params.halqaId);
        halqaAttendanceRecord = await HalqaAttendanceRecord.getById(page.params.halqaAttendanceRecordId);
        studentAttendanceRecord = await StudentAttendanceRecord.getById(page.params.studentAttendanceRecordId);
    });
</script>

<main>
    <Header>
        {#if halqaAttendanceRecord != null}
            <h1>{dayjs(halqaAttendanceRecord.attendanceDay.date).format('dddd DD/MM/YYYY')}</h1>
            <div style="flex: 1;"></div>
            <div style="position: absolute; left: 50%; transform: translate(-50%, 0);">
                <h1>حضور {studentAttendanceRecord?.student.fullName}</h1>
            </div>
        {/if}
    </Header>

    <div class="container">
        <div style="height: 100px;"></div>
        <StudentAttendanceFormRenderer bind:studentAttendanceRecord={studentAttendanceRecord}/>
    </div>
</main>

<style>
    h1 {
        margin-inline-start: 50px;
    }

    .container {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;

        position: relative;
    }
</style>
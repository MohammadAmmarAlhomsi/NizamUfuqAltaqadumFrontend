<script>
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { fetchHalqaAttendanceRecord, fetchHalqaById, fetchStudentAttendanceRecord } from "$lib/sdk/halqa";
    
    import Header from "$lib/components/layout/Header.svelte";
    import HalqaAttendanceForm from "$lib/components/forms/HalqaAttendanceForm.svelte";
    import StudentAttendanceForm from "$lib/components/forms/StudentAttendanceForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import PageCancellationWindow from "$lib/components/PageCancellationWindow.svelte";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    let halqaId = $state(page.params.halqaId);
    let halqaAttendanceRecordId = $state(page.params.halqaAttendanceRecordId);
    let studentAttendanceRecordId = $state(page.params.studentAttendanceRecordId);

    let halqa = $state(null);
    let halqaAttendanceRecord = $state(null);
    let studentAttendanceRecord = $state(null);

    function handleSubmitClick() {

    }

    onMount(async () => {
        console.log($state.snapshot(halqaAttendanceRecord));

        try {
            halqa = await fetchHalqaById(halqaId);
            console.log('halqa');
            console.log($state.snapshot(halqa));
        } catch (e) {
            alert('حدث خطأ أثناء تحصيل الحلقة.');
            console.error(e);
        }

        try {
            halqaAttendanceRecord = await fetchHalqaAttendanceRecord(halqaId, halqaAttendanceRecordId);
            console.log('halqa attendance record:');
            console.log($state.snapshot(halqaAttendanceRecord));
            console.log(halqaAttendanceRecord.attendanceDay.date)
        } catch (e) {
            alert('حدث خطأ أثناء تحصيل ملف تسحيل الحضور.');
            console.error(e);
        }

        try {
            studentAttendanceRecord = await fetchStudentAttendanceRecord(halqaId, halqaAttendanceRecordId, studentAttendanceRecordId);
            console.log('student attendance record:');
            console.log($state.snapshot(studentAttendanceRecord));
        } catch (e) {
            alert('حدث خطأأثناء تحصيل ملف حضور الطالب.')
            console.error(e);
        }
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
        <StudentAttendanceForm bind:studentAttendanceRecord={studentAttendanceRecord}/>
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
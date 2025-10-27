<script>
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { fetchHalqaAttendanceRecord, fetchHalqaById } from "$lib/sdk/halqa";
    
    import Header from "$lib/components/layout/Header.svelte";
    import HalqaAttendanceForm from "$lib/components/forms/HalqaAttendanceForm.svelte";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    let halqaId = $state(page.params.halqaId);
    let halqaAttendanceRecordId = $state(page.params.halqaAttendanceRecordId);

    let halqa = $state(null);
    let attendanceRecord = $state(null);

    onMount(async () => {
        try {
            halqa = await fetchHalqaById(halqaId);
            console.log($state.snapshot(halqa));
        } catch (e) {
            alert('حدث خطأ أثناء تحصيل الحلقة.');
            console.error(e);
        }

        try {
            attendanceRecord = await fetchHalqaAttendanceRecord(halqaId, halqaAttendanceRecordId);
            console.log($state.snapshot(attendanceRecord));
            console.log(attendanceRecord.attendanceDay.date)
        } catch (e) {
            alert('حدث خطأ أثناء تحصيل ملف تسحيل الحضور.');
            console.error(e);
        }
    });
</script>

<main>
    <Header>
        {#if attendanceRecord != null}
            <h1>{dayjs(attendanceRecord.attendanceDay.date).format('dddd DD/MM/YYYY')}</h1>
            <div style="position: absolute; left: 50%; transform: translate(-50%, 0);">
                <h1>حضور الحلقة</h1>
            </div>
        {/if}
    </Header>

    <div class="container">
        <HalqaAttendanceForm 
            bind:halqa={halqa}
            bind:halqaAttendance={attendanceRecord}
            />
    </div>
</main>

<style>
    h1 {
        margin-inline-start: 50px;
    }

    .container {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }
</style>
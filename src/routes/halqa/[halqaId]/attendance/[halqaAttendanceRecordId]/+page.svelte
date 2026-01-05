<script>
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { fetchHalqaAttendanceRecord, fetchHalqaById } from "$lib/sdk/halqa";
    import { Halqa } from "$lib/sdk/models/halqa.svelte";
    import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
    
import Header from "$lib/components/layout/Header.svelte";
import HalqaAttendanceForm from "$lib/components/forms/HalqaAttendanceForm.svelte";
import LoaderOverlay from "$lib/components/LoaderOverlay.svelte";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    let halqaId = $state(page.params.halqaId);
    let halqaAttendanceRecordId = $state(page.params.halqaAttendanceRecordId);

    /** @type {Halqa} */
    let halqa = $state(null);

    /** @type {HalqaAttendanceRecord} */
    let attendanceRecord = $state(null);

    let loadingPage = $state(true);

    onMount(async () => {
        try {
            halqa = await Halqa.getById(halqaId);
            attendanceRecord = await HalqaAttendanceRecord.getById(halqaAttendanceRecordId);

            if (attendanceRecord == null || halqa == null) {
                alert('حدث خطأ أثناء تحصيل بيانات الحلقة أو ملف تسجيل الحضور.');
                return;
            }
        } finally {
            loadingPage = false;
        }
    });
</script>

<main>
    {#if loadingPage}
        <div style="height: var(--header-height, 140px); width: 100%;"></div>
        <LoaderOverlay text="جارٍ تحميل سجل الحضور..." />
    {/if}
    <Header>
        {#if attendanceRecord != null}
            <div class="attendance-header">
                <h1 class="attendance-date">{dayjs(attendanceRecord.attendanceDay.date).format('dddd DD/MM/YYYY')}</h1>
                <h1 class="attendance-title">حضور الحلقة</h1>
            </div>
        {/if}
    </Header>

    <div class="container">
        <HalqaAttendanceForm 
            bind:halqa={halqa}
            bind:halqaAttendanceId={halqaAttendanceRecordId}
            />
    </div>
</main>

<style>
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

    .attendance-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
        text-align: center;
    }

    .attendance-date,
    .attendance-title {
        margin: 0;
        font-size: 1.6em;
    }

    .attendance-title {
        font-size: 1.5em;
    }

    @media (max-width: 768px) {
        .attendance-date,
        .attendance-title {
            font-size: 1.3em;
        }

        .attendance-header {
            gap: 10px;
        }
    }
</style>

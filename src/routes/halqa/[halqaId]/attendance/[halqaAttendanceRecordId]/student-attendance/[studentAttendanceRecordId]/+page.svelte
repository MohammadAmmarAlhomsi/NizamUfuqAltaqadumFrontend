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
    let isLoading = $state(true);

    onMount(async () => {
        try {
            halqa = await Halqa.getById(page.params.halqaId);
            halqaAttendanceRecord = await HalqaAttendanceRecord.getById(page.params.halqaAttendanceRecordId);
            studentAttendanceRecord = await StudentAttendanceRecord.getById(page.params.studentAttendanceRecordId);
        } finally {
            isLoading = false;
        }
    });
</script>

<main>
    <Header>
        {#if halqaAttendanceRecord != null}
            <div class="attendance-header">
                <div class="attendance-title">
                    <span class="eyebrow">حضور الطالب</span>
                    <h1>{studentAttendanceRecord?.student.fullName}</h1>
                </div>
                <div class="attendance-subtitle">
                    <span>{dayjs(halqaAttendanceRecord.attendanceDay.date).format('dddd DD/MM/YYYY')}</span>
                </div>
            </div>
        {/if}
    </Header>

    <div class="header-spacer"></div>

    <div class="container">
        {#if isLoading}
            <div class="loading">جارٍ تحميل بيانات الطالب...</div>
        {:else}
            <div class="form-scroll">
                <StudentAttendanceFormRenderer bind:studentAttendanceRecord={studentAttendanceRecord}/>
            </div>
        {/if}
    </div>
</main>

<style>
    .container {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        padding: 0 16px 24px;
        box-sizing: border-box;
    }

    .form-scroll {
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
    }

    .attendance-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 12px 24px;
        width: 100%;
        flex-wrap: wrap;
        box-sizing: border-box;
    }

    .attendance-title {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 220px;
        max-width: 100%;
    }

    .attendance-title h1 {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 700;
        word-break: break-word;
    }

    .attendance-subtitle {
        font-size: 1rem;
        color: #333;
        padding: 6px 14px;
        border: 1px solid #ddd;
        border-radius: 999px;
        background: #fafafa;
    }

    .eyebrow {
        font-size: 0.85rem;
        color: #666;
        letter-spacing: 0.02em;
    }

    .header-spacer {
        height: 140px;
        width: 100%;
    }

    .loading {
        width: 100%;
        text-align: center;
        padding: 24px 0;
        color: #555;
        font-weight: 600;
    }

    @media (max-width: 900px) {
        .attendance-header {
            justify-content: center;
            padding: 12px 16px;
        }

        .attendance-title {
            text-align: center;
            align-items: center;
        }

        .attendance-subtitle {
            width: 100%;
            text-align: center;
        }

        .header-spacer {
            height: 260px;
        }
    }
</style>

<script>
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { fetchHalqaAttendanceRecord, fetchHalqaById } from "$lib/sdk/halqa";
    import { Halqa } from "$lib/sdk/models/halqa.svelte";
    import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
    
    import Header from "$lib/components/layout/Header.svelte";
    import HalqaAttendanceForm from "$lib/components/forms/HalqaAttendanceForm.svelte";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    let halqaId = $state(page.params.halqaId);
    let halqaAttendanceRecordId = $state(page.params.halqaAttendanceRecordId);

    /** @type {Halqa} */
    let halqa = $state(null);

    /** @type {HalqaAttendanceRecord} */
    let attendanceRecord = $state(null);

    onMount(async () => {
        halqa = await Halqa.getById(halqaId);
        attendanceRecord = await HalqaAttendanceRecord.getById(halqaAttendanceRecordId);

        if (attendanceRecord == null || halqa == null) {
            alert('حدث خطأ أثناء تحصيل بيانات الحلقة أو ملف تسجيل الحضور.');
            return;
        }
    });
</script>

<main>
    <Header>
        {#if attendanceRecord != null}
            <div class="attendance-header">
                <div class="attendance-title">
                    <span class="eyebrow">حضور الحلقة</span>
                    <h1>{dayjs(attendanceRecord.attendanceDay.date).format('dddd DD/MM/YYYY')}</h1>
                </div>
                <div class="attendance-subtitle">
                    <span>{halqa?.name}</span>
                </div>
            </div>
        {/if}
    </Header>

    <div class="header-spacer"></div>

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
        padding: 0 16px 24px;
        box-sizing: border-box;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
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
    }

    .attendance-title h1 {
        margin: 0;
        font-size: 1.6rem;
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
        height: 110px;
        width: 100%;
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
            height: 680px;
        }

        .container {
            padding-top: 112px;
        }
    }

    @media (max-width: 520px) {
        .attendance-title h1 {
            font-size: 1.35rem;
        }
    }
</style>

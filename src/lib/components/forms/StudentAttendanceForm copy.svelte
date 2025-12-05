<script>
    import { onMount } from "svelte";
    import { fetchAccessiblePagesOverview } from "$lib/sdk/student";
    import { 
        cancelPageRecitationReward, 
        registerPageRecitations, 
        updateStudentAttendance 
    } from "$lib/sdk/halqa";
    import { QuranPage } from "$lib/sdk/models/quran-page.svelte";
    
    import DropdownField from "../DropdownField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import RecitationPageBox from "../page-recitation-box/PageRecitationBoxRenderer.svelte";
    import { 
        deletePageRecitationRecordAsync, 
        deletePageRecitationRewardCancellationRecordAsync 
    } from "$lib/sdk/halqa";

    import { Student } from "$lib/sdk/models/student.svelte";
    import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";
    import { PageRecitationRecord } from "$lib/sdk/models/page-recitation-record.svelte";
    import { PageRecitationRewardCancellationRecord as RewardCancellationRecord } from "$lib/sdk/models/page-recitation-reward-cancellation-record.svelte";

    /** @type {{studentAttendanceRecord: StudentAttendanceRecord}} */
    let { studentAttendanceRecord = $bindable(null), ...props } = $props();

    let accessableQuranPagesOverview = $state([]);
    let highlightedPages = $state([]); 

    /** @type {Student} */
    let student = $state(null);

    /** @type {Array<QuranPage>} */ let accessibleQuranPages = $state([]);
    /** @type {Array<PageRecitationRecord>} */ let recitedPagesRecords = $state([]);
    /** @type {Array<RewardCancellationRecord>} */ let pagesRewardCancellationRecords = $state([]);

    // -----------------------

    /** @type {Array<QuranPage>} */ 
    let selectedQuranPages = $state([]); 

    let showRecitationRecords = $derived(
        studentAttendanceRecord?.status == 'Attended' || 
        studentAttendanceRecord?.status == 'AttendedLate'
    );

    // -----------------------

    async function load() {
        student = await Student.getById(studentAttendanceRecord.studentId);
        accessibleQuranPages = await student.getAccessibleQuranPages();
        recitedPagesRecords = await PageRecitationRecord.getStudentAvailablePageRecitationRecords(student.id);
        pagesRewardCancellationRecords = await RewardCancellationRecord.getStudentAccessibleRecords(student.id);
    }

    $effect(async () => {
        if (studentAttendanceRecord != null) {
            await load();
        }
    });

    async function loadQuranPages() {
        try {
            accessableQuranPagesOverview = await fetchAccessiblePagesOverview(studentAttendanceRecord.student.id);
            accessableQuranPagesOverview = accessableQuranPagesOverview.map(p => ({
                ...p,
                recitationDate: new Date(p.recitationDate),
                isHighlighted: false
            }));
        } catch (e) {
            alert("حدث خطأ أثناء تحصيل الصفحات المتاحة.");
            console.error(e);
        }
    }

    /**
     * @param {QuranPage} quranPage
     * @returns {PageRecitationRecord}
     */
    function findRecitationRecord(quranPage) {
        if (quranPage == null) return null;
        return recitedPagesRecords.find(record => record.pageId == quranPage.id);
    }

    /**
     * @param {PageRecitationRecord} recitationRecord
     * @returns {RewardCancellationRecord}
     */
    function findCancellationRecord(recitationRecord) {
        if (recitationRecord == null) return null;
        return pagesRewardCancellationRecords.find(record => record.pageRecitationRecordId == recitationRecord.id);
    }

    /** 
     * @param {QuranPage} quranPage
     */
    function selectPage2(quranPage) {
        let recitationRecord = findRecitationRecord(quranPage);
        let rewardCancellationRecord = findCancellationRecord(recitationRecord);

        if (rewardCancellationRecord != null) {

        } else if (recitationRecord != null) {

        } else {

        }
    }

    function selectPage(page) {
        if (!page) {
            accessableQuranPagesOverview.forEach(p => (p.isHighlighted = false));
            highlightedPages = [];
            resetButtons();
            return;
        }

        if (page.isRecited || page.isRecitationCancelled) {
            accessableQuranPagesOverview.forEach(p => (p.isHighlighted = false));
            page.isHighlighted = true;
            highlightedPages = [page];
        } else {
            if (page.isHighlighted) {
                page.isHighlighted = false;
                highlightedPages = highlightedPages.filter(p => p.id !== page.id);
            } else {
                page.isHighlighted = true;
                highlightedPages = [...highlightedPages, page];
            }
        }

        updateButtonsVisibility();
    }

    /** * @param {QuranPage} page */
    function handleClickQuranPage(page) {

    }

    function resetButtons() {
        showRecitationRegisterer = false;
        showRecitationDeleter = false;
        showPageRewardCanceller = false;
        showPageRewardCancellationDeleter = false;
    }

    function updateButtonsVisibility() {
        if (highlightedPages.length === 0) {
            resetButtons();
            return;
        }

        const allNonRecited = highlightedPages.every(p => !p.isRecited && !p.isRecitationCancelled);
        const singlePage = highlightedPages.length === 1;
        const first = highlightedPages[0];

        showRecitationRegisterer = allNonRecited;
        showRecitationDeleter = singlePage && (first.isRecited || first.isRecitationCancelled);
        showPageRewardCanceller = singlePage && first.isRecited && !first.isRecitationCancelled;
        showPageRewardCancellationDeleter = singlePage && first.isRecitationCancelled;
    }

    async function handleSubmit() {
        const { id, ...dto } = studentAttendanceRecord;
        await studentAttendanceRecord.save();
        history.back();
    }

    // ✅ Register all highlighted pages together
    async function registerRecitation() {
        if (highlightedPages.length === 0) return;

        try {
            await registerPageRecitations({
                pagesIds: highlightedPages.map(p => p.id),
                studentAttendanceRecordId: studentAttendanceRecord.id
            });

            await loadQuranPages();
            selectPage(null);
        } catch (e) {
            alert("حدث خطأ أثناء تسجيل الحفظ.");
            console.error(e);
        }
    }

    async function deleteRecitation() {
        if (highlightedPages.length !== 1) return;
        const page = highlightedPages[0];

        try {
            await deletePageRecitationRecordAsync(page.recitationPageRecordId);
            await loadQuranPages();
            selectPage(null);
        } catch (e) {
            alert("حدث خطأ أثناء حذف التسميع.");
            console.error(e);
        }
    }

    async function cancelPageReward() {
        if (highlightedPages.length !== 1) return;
        const page = highlightedPages[0];

        try {
            await cancelPageRecitationReward(page.recitationPageRecordId);
            await loadQuranPages();
            selectPage(null);
        } catch (e) {
            alert("حدث خطأ أثناء إلغاء نقاط الصفحة.");
            console.error(e);
        }
    }

    async function deletePageCancellation() {
        if (highlightedPages.length !== 1) return;
        const page = highlightedPages[0];

        try {
            await deletePageRecitationRewardCancellationRecordAsync(page.recitationPageRecordId);
            await loadQuranPages();
            selectPage(null);
        } catch (e) {
            alert("حدث خطأ أثناء إلغاء مبطل النقاط.");
            console.error(e);
        }
    }

    let numberContainer = $state({value: 0});
</script>

<div class="container">
    <div style="height: 20px;"></div>

    {#if studentAttendanceRecord != null}
        <DropdownField
            label="الحضور"
            options={[
                { value: "Attended", text: "حاضر" },
                { value: "AttendedLate", text: "حاضر متأخر" },
                { value: "AbscentWithExecuse", text: "غياب بعذر" },
                { value: "AbscentWithoutExecuse", text: "غياب بدون عذر" },
            ]}
            bind:value={studentAttendanceRecord.status}
            zeroValue={null}
        />

        <div style="height: 30px;"></div>

        {#if showRecitationRecords}
            <div class="actions-buttons-container">
                {#if false} <Button onclick={registerRecitation}>تسجيل الحفظ</Button> {/if}
                {#if false} <Button onclick={deleteRecitation}>حذف التسميع</Button> {/if}
                {#if false} <Button onclick={cancelPageReward}>إلغاء نقاط الصفحة</Button> {/if}
                {#if false} <Button onclick={deletePageCancellation}>إلغاء مبطل النقاط</Button> {/if}
                {#if false} <Button onclick={() => selectPage(null)}>إلغاء التحديد</Button> {/if}
            </div>

            <p><b>الحفظ:</b></p>
            <div style="height: 10px;"></div>

            <div class="pages-container">
                {#each accessibleQuranPages as page, i}
                    <RecitationPageBox
                        onclick={() => handleClickQuranPage(page)}
                        bind:quranPage={accessibleQuranPages[i]}
                        bind:studentAttendanceRecord={studentAttendanceRecord}
                    />
                {/each}
            </div>
        {/if}

        <div style="height: 100px; margin-bottom: 30px">
            <TextAreaField bind:value={studentAttendanceRecord.notes} label="الملاحظات" />
        </div>
    {:else}
        لم يتم تنزيل سجل الطالب!
    {/if}

    <div class="save-button-container">
        <Button onclick={handleSubmit}>حفظ</Button>
    </div>
</div>

<style>
    .actions-buttons-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 25px;
        height: 50px;
    }

    .save-button-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .pages-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
        gap: 15px;
        margin-bottom: 40px;
    }

    .container {
        padding: 20px;
        direction: rtl;
    }
</style>
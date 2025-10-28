<script>
    import { onMount } from "svelte";
    import { fetchAccessiblePagesOverview } from "$lib/sdk/student";
    import { 
        cancelPageRecitationReward, 
        registerPageRecitations, 
        updateStudentAttendance 
    } from "$lib/sdk/halqa";
    
    import DropdownField from "../DropdownField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import RecitationPageBox from "../RecitationPageBox.svelte";
    import { 
        deletePageRecitationRecordAsync, 
        deletePageRecitationRewardCancellationRecordAsync 
    } from "$lib/sdk/halqa";

    let { studentAttendanceRecord = $bindable(null), ...props } = $props();

    let accessableQuranPagesOverview = $state([]);
    let highlightedPages = $state([]); // multiple selection array

    let showRecitationRegisterer = $state(false);
    let showRecitationDeleter = $state(false);
    let showPageRewardCanceller = $state(false);
    let showPageRewardCancellationDeleter = $state(false);

    // Load pages when attendance record available
    $effect(async () => {
        if (studentAttendanceRecord != null) {
            await loadQuranPages();
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

    // ✅ Multi-selection with single-selection override for recited pages
    function selectPage(page) {
        if (!page) {
            // Deselect all
            accessableQuranPagesOverview.forEach(p => (p.isHighlighted = false));
            highlightedPages = [];
            resetButtons();
            return;
        }

        // If page is recited or cancelled → disable all others and highlight only this one
        if (page.isRecited || page.isRecitationCancelled) {
            accessableQuranPagesOverview.forEach(p => (p.isHighlighted = false));
            page.isHighlighted = true;
            highlightedPages = [page];
        } else {
            // Toggle non-recited pages
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
        try {
            await updateStudentAttendance(studentAttendanceRecord.id, dto);
            history.back();
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء الحفظ.");
        }
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
</script>

<div class="container">
    <div style="height: 20px;"></div>

    {#if studentAttendanceRecord != null}
        <DropdownField
            label="الحضور"
            options={[
                { value: "Attended", text: "حاضر" },
                { value: "AbscentWithExecuse", text: "غياب بعذر" },
                { value: "AbscentWithoutExecuse", text: "غياب بدون عذر" }
            ]}
            bind:value={studentAttendanceRecord.status}
            zeroValue={null}
        />

        <div style="height: 30px;"></div>

        {#if studentAttendanceRecord.status === "Attended"}
            <div class="actions-buttons-container">
                {#if showRecitationRegisterer}
                    <Button onclick={registerRecitation}>تسجيل الحفظ</Button>
                {/if}
                {#if showRecitationDeleter}
                    <Button onclick={deleteRecitation}>حذف التسميع</Button>
                {/if}
                {#if showPageRewardCanceller}
                    <Button onclick={cancelPageReward}>إلغاء نقاط الصفحة</Button>
                {/if}
                {#if showPageRewardCancellationDeleter}
                    <Button onclick={deletePageCancellation}>إلغاء مبطل النقاط</Button>
                {/if}
                {#if highlightedPages.length > 0}
                    <Button onclick={() => selectPage(null)}>إلغاء التحديد</Button>
                {/if}
            </div>

            <p><b>الحفظ:</b></p>
            <div style="height: 10px;"></div>

            <div class="pages-container">
                {#each accessableQuranPagesOverview as page, i}
                    <RecitationPageBox
                        onclick={() => selectPage(page)}
                        bind:quranPage={accessableQuranPagesOverview[i]}
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

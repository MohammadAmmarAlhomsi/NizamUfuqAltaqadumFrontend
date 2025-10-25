<script>
    import { onMount } from "svelte";
    import { fetchAccessiblePagesOverview, fetchAllAccessibleStudentPages } from "$lib/sdk/student";
    import { cancelPageRecitationReward, fetchStudentAttendanceRecord, registerPageRecitations, registerStudentAttendance, updateStudentAttendance } from "$lib/sdk/halqa";
    
    import DropdownField from "../DropdownField.svelte";
    import FormInputField from "../FormInputField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import RecitationPageBox from "../RecitationPageBox.svelte";
    import PageCancellationWindow from "../PageCancellationWindow.svelte";

    let { 
        studentAttendanceRecord=$bindable(null), 
        ...props 
    } = $props();

    let accessableQuranPagesOverview = $state([]);

    let pageCancellationWindow = $state();
    let showOverlay = $state(false);
    let clickedRecitedPageRecord = $state(null);

    onMount(() => {
        console.log($state.snapshot(accessableQuranPagesOverview));
    });

    $effect(async () => {
        if (studentAttendanceRecord != null) {
            try {
                accessableQuranPagesOverview = await fetchAccessiblePagesOverview(studentAttendanceRecord.student.id);
                accessableQuranPagesOverview = accessableQuranPagesOverview.map(p => {
                    return {...p, recitationDate: new Date(p.recitationDate), isHighlighted: false }
                })

                console.log('student accessable pages overview:');
                console.log($state.snapshot(accessableQuranPagesOverview));
            } catch (e) {
                alert('حدث خطأ أثناء تحصيل الصفحات المتاحة.')
                console.error(e);
            }
        }
    });

    async function handleSubmit() {
        let highlightedPages = accessableQuranPagesOverview.filter(p => p.isHighlighted);
        let ids = highlightedPages.map(p => p.id);
        let { id, ...dto } = studentAttendanceRecord;

        try {
            if (highlightedPages.length > 0) {
                await registerPageRecitations({pagesIds: ids, studentAttendanceRecordId: studentAttendanceRecord.id})
            }
            await updateStudentAttendance(studentAttendanceRecord.id, dto);
            
            location.reload();
            alert('تم الحفظ بنجاح')
        } catch(e) {
            console.error(e);
            alert('حدث خطأ أثناء تسجيل الحفظ.');
        }
    }

    async function handleRecitationPageClick(recitationPage) {
        let idx = accessableQuranPagesOverview.indexOf(recitationPage);

        if (!recitationPage.isRecited) {
            recitationPage.isHighlighted = !recitationPage.isHighlighted;
        } else if (!recitationPage.isRecitationCancelled) {
            clickedRecitedPageRecord = recitationPage;
            showOverlay = true;
        }
    }

    async function handlePageCancellation(isAccepted) {
        if (isAccepted) {
            try {
                await cancelPageRecitationReward(clickedRecitedPageRecord.recitationPageRecordId);
                location.reload();
            } catch(e) {
                alert('حدث خطأ أثناء إلغاء صفحة.')
            }
        }

        clickedRecitedPageRecord = null;
    }

</script>

<div class="container">
    <div style="height: 20px;"></div>

    {#if studentAttendanceRecord != null}
        <DropdownField label='الحضور' options={[
            { value: 'Attended', text: 'حاضر' },
            { value: 'AbscentWithExecuse', text: 'غياب بعذر' },
            { value: 'AbscentWithoutExecuse', text: 'غياب بدون عذر' }
        ]} bind:value={studentAttendanceRecord.status} zeroValue={null}/>

        {#if studentAttendanceRecord.status == 'Attended'}
            <p>الحفظ: { ``}</p>
            <div style="height: 15px;"></div>
            <div class="pages-container">
                {#each accessableQuranPagesOverview as _, i}
                    <RecitationPageBox 
                        onclick={() => handleRecitationPageClick(accessableQuranPagesOverview[i])}
                        bind:quranPage={accessableQuranPagesOverview[i]}
                        bind:studentAttendanceRecord={studentAttendanceRecord}
                        />
                {/each}
            </div>
        {:else}
            <div style="height: 50px"></div>
        {/if}

        <div style="height: 100px; margin-bottom: 30px">
            <TextAreaField bind:value={studentAttendanceRecord.notes} label='الملاحظات'/>
        </div>
    {:else}
        لم يتم تنزيل سجل الطالب!
    {/if}

    <div class="save-button-container">
        <Button onclick={handleSubmit}>حفظ</Button>
    </div>
</div>

{#if showOverlay}
    <div class="overlay">
        <PageCancellationWindow callback={handlePageCancellation} bind:showOverlay={showOverlay} />
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;

        background: rgba(0, 0, 0, 0.8);
        z-index: 1;

        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px;
    }

    .save-button-container {
        width: 100%;
        display: flex;
        justify-content: end;
    }

    .pages-container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 15px;
        margin-bottom: 40px;
    }
</style>
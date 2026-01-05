<script>
import Header from '$lib/components/layout/Header.svelte';
import LoaderOverlay from '$lib/components/LoaderOverlay.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import Button from '$lib/components/Button.svelte';
    import TabsContainer from '$lib/components/TabsContainer.svelte';
    import StudentAttendanceForm from '$lib/components/forms/student-attendance-form/StudentAttendanceFormRenderer.svelte';
    import HalqaAttendanceForm from '$lib/components/forms/HalqaAttendanceForm.svelte';
    import BaseHalqaRecordInitiatorForm from '$lib/components/forms/BaseHalqaRecordInitiatorForm.svelte';
    import GroupActivitiesSectionRenderer from '$lib/components/group-activities-section/group-activities-section-renderer.svelte';

    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission, createInstructor, getInstructorById, verifyUpdateInstructorPermission, updateInstructorAsync, fetchPairedInstructor, fetchResponsibleHalqat } from '$lib/sdk/instructor';
    import { fetchAllHalqaAttendances, fetchHalqaById, fetchHalqaGroupActivities, registerHalqaAttendance } from '$lib/sdk/halqa';
    import { FollowUpSection } from '$lib/components/forms/follow-up-section/follow-up-section.svelte';
    import { GroupActivitiesSection } from '$lib/components/group-activities-section/group-activities-section.svelte';

    import dayjs from "dayjs";
    import IndivisualActivityForm from '$lib/components/forms/IndivisualActivityForm.svelte';
    import GroupActivityForm from '$lib/components/forms/GroupActivityForm.svelte';
    import GroupActivityRecordItem from '$lib/components/GroupActivityRecordItem.svelte';
    import StudentsSection from './StudentsSection.svelte';
    
    import "dayjs/locale/ar";
    import FollowUpSectionRenderer from '$lib/components/forms/follow-up-section/follow-up-section-renderer.svelte';

    dayjs.locale("ar");

    let instructor = $state(null);
    let halqaId = $state(page.params.halqaId);
    let halqa = $state(null);
    let tabIndex = $state(0);
    let attendancesRecords = $state([]);
    let groupsActivities = $state([]);

    let followUpSection = $state(new FollowUpSection(halqaId));

    let showBaseHalqaInitiator = $state(false);
    let showIndivsualActivityForm = $state(false);
    let showGroupActivityForm = $state(false);

    let initialTabIdx = page.url.searchParams.get('tabIdx')
    let hasInitialized = false;

    let loadingPage = $state(true);

    onMount(async () => {
        const param = new URL(window.location.href).searchParams.get('tabIdx');
        tabIndex = param !== null ? Number(param) : 0;
        
        await followUpSection.onMount();
    });

    $effect(() => {
        const url = new URL(window.location.href);
        const currentTab = Number(url.searchParams.get('tabIdx')) || 0;

        if (tabIndex !== currentTab) {
            url.searchParams.set('tabIdx', tabIndex);
            goto(url.pathname + url.search, { replaceState: true });
        }
    });

    async function retrieveHalqaStudents() {
        try {
            let h = await fetchHalqaById(halqaId);
            return h.students;
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async function handleHalqaAttendanceRegistration() {
        showBaseHalqaInitiator = true;
    }

    async function handleSubmitRegistration(day) {
        showBaseHalqaInitiator = false;
        
        try {
            await registerHalqaAttendance({
                halqaId,
                attendanceDayId: day.id,
            })

            await fetchHalqat();

        } catch (e) {
            console.error(e);
            alert('حدث خطأ أثناء تسجيل الحضور.');
        }
    }

    async function handleClickAttendanceRecord(attendanceRecord) {
        window.location.href = `/halqa/${halqaId}/attendance/${attendanceRecord.id}`
    }

    async function fetchHalqat() {
        try {
            attendancesRecords = await fetchAllHalqaAttendances(halqaId);
            console.log($state.snapshot(attendancesRecords));
        } catch (e) {
            alert('حدث خطأ أثناء تحميل حضور الحلقة.')
            console.error(e);
        }
    }

    function handleCancel() {
        showBaseHalqaInitiator = false;
    }

    async function handleAddGroupActivity() {
        showGroupActivityForm = true;
    }

    async function handleAddIndividualActivity() {
        showIndivsualActivityForm = true;
    }
    
    onMount(async () => {
        try {
            let userData = await getUserData();
            console.log(userData);
            if (userData == null) {
                window.location.href = `/signin`;
                return;
            }

            try {
                halqa = await fetchHalqaById(halqaId);
                console.log($state.snapshot(halqa));
            } catch (e) {
                console.error(e);
            }

            await fetchGroupActivities();
            await fetchHalqat();
        } finally {
            loadingPage = false;
        }
    })

    async function fetchGroupActivities() {
        try {
            groupsActivities = await fetchHalqaGroupActivities(halqaId);
            console.log('group activities:');
            console.log($state.snapshot(groupsActivities));
        } catch (e) {
            console.error(e);
        }
    }

    async function onDeleteGroupRecord() {
        await fetchGroupActivities();
    }

    async function handleCreateActivity() {
        await fetchGroupActivities();
    }

    let groupActivitiesSection = $state(new GroupActivitiesSection(halqaId));
</script>

<main>
    {#if loadingPage}
        <div style="height: var(--header-height, 140px); width: 100%;"></div>
        <LoaderOverlay text="جارٍ تحميل بيانات الحلقة..." />
    {/if}

    <Header>
        <div class="halqa-header">
            <h1 class="halqa-title">{halqa?.name}</h1>
            <div class="halqa-tabs">
                <TabsContainer bind:selectedIdx={tabIndex} tabs={[ 
                    { label: 'الطلاب' }, 
                    { label: 'المتابعة' }, 
                    { label: 'الأنشطة' }]}>
                </TabsContainer>
            </div>
        </div>
    </Header>

    {#if tabIndex == 0}
        <StudentsSection bind:halqa={halqa}/>
    {:else if tabIndex == 1}
        <FollowUpSectionRenderer bind:source={followUpSection}/>
    {:else if tabIndex == 2}
        <GroupActivitiesSectionRenderer bind:source={groupActivitiesSection}/>
        <!-- <Button width='150px' onclick={handleAddGroupActivity}>إضافة نشاط جماعي</Button>

        <div class="group-activities-container">
            {#each groupsActivities as groupActivity, i}
                <GroupActivityRecordItem 
                    bind:halqa={halqa} 
                    bind:activityRecord={groupsActivities[i]}
                    onDelete={onDeleteGroupRecord}
                    />
            {/each}
        </div> -->
    {/if}
    
    <div style="height: 50px;"></div>

    {#if showBaseHalqaInitiator}
        <div class="overlay">
            <BaseHalqaRecordInitiatorForm 
                onSubmit={handleSubmitRegistration}
                onCancel={handleCancel} 
                bind:halqa={halqa}/>
        </div>
    {/if}

    {#if showIndivsualActivityForm}
        <div class="overlay">
            <IndivisualActivityForm 
                bind:halqa={halqa}
                bind:show={showIndivsualActivityForm}
                />
        </div>
    {/if}

    {#if showGroupActivityForm}
        <div class="overlay">
            <GroupActivityForm
                bind:halqa={halqa}
                bind:show={showGroupActivityForm}
                onCreateActivity={handleCreateActivity}
                />
        </div>
    {/if}

</main>

<style>
    .group-activities-container {
        margin-top: 50px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
        gap: 25px;
        text-align: center;

        width: 50%;
        justify-content: center;
    }

    main {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 2;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .halqa-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
    }

    .halqa-title {
        font-size: 1.9em;
        margin: 0;
        text-align: center;
        flex: 1 1 auto;
    }

    .halqa-tabs {
        flex: 0 1 auto;
        display: flex;
        justify-content: center;
    }

    @media (max-width: 900px) {
        .halqa-title {
            font-size: 1.5em;
        }

        .halqa-tabs {
            width: 100%;
            justify-content: center;
        }
    }
</style>

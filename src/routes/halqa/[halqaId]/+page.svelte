<script>
    import Header from '$lib/components/layout/Header.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import Button from '$lib/components/Button.svelte';
    import TabsContainer from '$lib/components/TabsContainer.svelte';
    import StudentAttendanceForm from '$lib/components/forms/StudentAttendanceForm.svelte';
    import HalqaAttendanceForm from '$lib/components/forms/HalqaAttendanceForm.svelte';
    import BaseHalqaRecordInitiatorForm from '$lib/components/forms/BaseHalqaRecordInitiatorForm.svelte';

    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission, createInstructor, getInstructorById, verifyUpdateInstructorPermission, updateInstructorAsync, fetchPairedInstructor, fetchResponsibleHalqat } from '$lib/sdk/instructor';
    import { page } from '$app/state';
    import { fetchAllHalqaAttendances, fetchHalqaById, fetchHalqaGroupActivities, registerHalqaAttendance } from '$lib/sdk/halqa';

    import dayjs from "dayjs";
    import "dayjs/locale/ar";
    import IndivisualActivityForm from '$lib/components/forms/IndivisualActivityForm.svelte';
    import GroupActivityForm from '$lib/components/forms/GroupActivityForm.svelte';
    import GroupActivityRecordItem from '$lib/components/GroupActivityRecordItem.svelte';

    dayjs.locale("ar");

    let instructor = $state(null);
    let halqaId = $state(page.params.halqaId);
    let halqa = $state(null);
    let tabIndex = $state(2);
    let attendancesRecords = $state([]);
    let groupsActivities = $state([]);

    let showBaseHalqaInitiator = $state(false);
    let showIndivsualActivityForm = $state(false);
    let showGroupActivityForm = $state(false);

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
            alert('تم تسجيل حضور حلقة جديدة.');

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
        let userData = await getUserData();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }

        try {
            halqa = await fetchHalqaById(halqaId);
            console.log($state.snapshot(halqa));
        } catch (e) {
            console.error(e);
        }

        await fetchGroupActivities();

        await fetchHalqat();
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
</script>

<main>
    <Header>
        <h1 style="margin-inline-start: 50px; font-size: 2em;">{halqa?.name}</h1>
        <div style="position: absolute; right: 50%; transform: translate(50%, 0)">
            <TabsContainer bind:selectedIdx={tabIndex} tabs={[ 
                { label: 'الطلاب' }, 
                { label: 'المتابعة' }, 
                { label: 'الأنشطة الجماعية' }]}>
            </TabsContainer>
        </div>
    </Header>

    <div style="height: 110px;"></div>

    {#if tabIndex == 0}
        <h1 style="margin-bottom: 20px;">طلاب الحلقة</h1>
        <div class="container">
            <StudentsTable loadStudents={retrieveHalqaStudents} />
        </div> 
    {:else if tabIndex == 1}
        <Button onclick={handleHalqaAttendanceRegistration}>تسجيل يوم جديد</Button>

        <div style="height: 15px;"></div>

        <div class="attendance-days-container">
            {#each attendancesRecords as attendanceRecord}
                <button onclick={() => handleClickAttendanceRecord(attendanceRecord)} class="attendance-day-button">
                    <p>حضور {dayjs(attendanceRecord.attendanceDay.date).format("dddd DD/MM/YYYY")}</p>
                </button>
            {/each}
        </div>
    {:else if tabIndex == 2}
        <Button width='150px' onclick={handleAddGroupActivity}>إضافة نشاط جماعي</Button>

        <div class="group-activities-container">
            {#each groupsActivities as groupActivity, i}
                <GroupActivityRecordItem 
                    bind:halqa={halqa} 
                    bind:activityRecord={groupsActivities[i]}
                    onDelete={onDeleteGroupRecord}
                    />
            {/each}
        </div>
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

    .attendance-days-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .attendance-day-button {
        padding: 10px;
        background: white;
        box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
        border-radius: 15px;
        border: none;
        outline: none;
        margin-bottom: 15px;
        cursor: pointer;
    }

    main {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .container {
        width: 1400px;
    }

    .header-container {
        display: flex;
        justify-content: center;
        flex-direction: row;
    }

    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(2px);
        z-index: 2;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
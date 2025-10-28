<script>
    import Header from '$lib/components/layout/Header.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import Button from '$lib/components/Button.svelte';
    import TabsContainer from '$lib/components/TabsContainer.svelte';
    import StudentAttendanceForm from '$lib/components/forms/StudentAttendanceForm.svelte';
    import HalqaAttendanceForm from '$lib/components/forms/HalqaAttendanceForm.svelte';
    import BaseHalqaRecordInitiatorForm from '$lib/components/forms/BaseHalqaRecordInitiatorForm.svelte';

    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission, createInstructor, getInstructorById, verifyUpdateInstructorPermission, updateInstructorAsync, fetchPairedInstructor, fetchResponsibleHalqat } from '$lib/sdk/instructor';
    import { fetchAllHalqaAttendances, fetchHalqaById, fetchHalqaGroupActivities, registerHalqaAttendance } from '$lib/sdk/halqa';

    import dayjs from "dayjs";
    import IndivisualActivityForm from '$lib/components/forms/IndivisualActivityForm.svelte';
    import GroupActivityForm from '$lib/components/forms/GroupActivityForm.svelte';
    import GroupActivityRecordItem from '$lib/components/GroupActivityRecordItem.svelte';
    
    import "dayjs/locale/ar";
    dayjs.locale("ar");

    let instructor = $state(null);
    let halqaId = $state(page.params.halqaId);
    let halqa = $state(null);
    let tabIndex = $state(0);
    let attendancesRecords = $state([]);
    let groupsActivities = $state([]);

    let showBaseHalqaInitiator = $state(false);
    let showIndivsualActivityForm = $state(false);
    let showGroupActivityForm = $state(false);

    let initialTabIdx = page.url.searchParams.get('tabIdx')
    let hasInitialized = false;

    onMount(() => {
        const param = new URL(window.location.href).searchParams.get('tabIdx');
        tabIndex = param !== null ? Number(param) : 0;
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

        <div style="height: 30px;"></div>

        <div class="attendance-days-container">
            {#each attendancesRecords as attendanceRecord, i}
                <button 
                    onclick={() => handleClickAttendanceRecord(attendanceRecord)} 
                    class:last-day={i == 0}
                    class="attendance-day-button"
                    >
                    <p>حضور {dayjs(attendanceRecord.attendanceDay.date).format("dddd DD/MM/YYYY")}</p>
                    <div style="height: 10px;"></div>
                    <div class="detailed-attendance-record">
                        <p class="green-text"><span class="color-box green"></span> الحضور: {attendanceRecord.studentsAttendanceRecords.filter(s => s.status == 'Attended').length}</p>
                        <p class="green-dark-text"><span class="color-box green-dark"></span> الحضور المتأخر: {attendanceRecord.studentsAttendanceRecords.filter(s => s.status == 'AttendedLate').length}</p>
                        <p class="yellow-text"><span class="color-box yellow"></span>  الغياب بعذر: {attendanceRecord.studentsAttendanceRecords.filter(s => s.status == 'AbscentWithExecuse').length}</p>
                        <p class="red-text"><span class="color-box red"></span> الغياب بدون بعذر: {attendanceRecord.studentsAttendanceRecords.filter(s => s.status == 'AbscentWithoutExecuse').length}</p>
                        <p class="white-text"><span class="color-box white"></span> بدون تحديد: {attendanceRecord.studentsAttendanceRecords.filter(s => !s.status).length}</p>
                    </div>
                    
                    <p style="text-align: start; margin-top: 5px"><b>الملاحظات:</b></p>
                    {#if attendancesRecords[i].notes}
                        <p style="text-align: start;">{attendancesRecords[i].notes}</p>
                    {:else}
                        <p>-----------------</p>
                    {/if}
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
    .last-day {
        transform: scale(1.075);       
        transition: transform 0.2s ease;
    }

    .color-box {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        display: inline-block;
        margin-inline-end: 10px;
    }

    .color-box.red {
        background-color: #e74c3c; /* red */
        /* box-shadow: 0px 0px 2px 0px rgba(255, 0, 0, 1.0); */
    }

    .color-box.yellow {
        background-color: #f1c40f; /* yellow */
        /* box-shadow: 0px 0px 2px 0px #f1c40f; */
    }

    .color-box.green {
        background-color: #27ae60; /* green */
        /* box-shadow: 0px 0px 2px 0px #27ae60; */
    }

    .color-box.green-dark {
        background-color: rgb(183, 231, 192);
    }

    .color-box.white {
        background: white;
        box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
    }

    .red-text {  color: #e74c3c; }
    .yellow-text { color: #f1c40f; }
    .green-text { color: #27ae60; }
    .green-dark-text { color: rgb(162, 224, 174); }

    .detailed-attendance-record {
        text-align: start;
    }

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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 220px));
        justify-content: center;
        gap: 30px;
        width: 80%;
    }

    .attendance-day-button {
        padding: 15px;
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
        width: 100%;
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
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 2;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<script>
    import Header from '$lib/components/layout/Header.svelte';
    import DropdownField from '$lib/components/DropdownField.svelte';

    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { fetchPairedExaminer } from '$lib/sdk/examiner';
    import { retrieveAllHalqat } from '$lib/sdk/halqa';

    import dayjs from "dayjs";
    import "dayjs/locale/ar";
    import { page } from '$app/state';

    let examiner = $state(null);
    let halqat = $state([]);
    let halqatOptions = $state([]);
    let selectedHalqaId = $state('');
    let selectedHalqa = $derived(halqat.find(h => h.id === selectedHalqaId) || null);
    
    let initialHalqaId = page.url.searchParams.get('selectedHalqaId');

    dayjs.locale("ar");

    onMount(async () => {
        const userData = await getUserData();
        if (!userData) {
            window.location.href = `/signin`;
            return;
        }

        await loadExaminer();
        await loadHalqat();

        selectedHalqaId = initialHalqaId ?? '';
    });

    async function loadExaminer() {
        try {
            examiner = await fetchPairedExaminer();
            console.log("Examiner:", $state.snapshot(examiner));
        } catch (e) {
            alert("حدث خطأ أثناء تحميل بيانات الممتحن.");
            console.error(e);
        }
    }

    async function loadHalqat() {
        try {
            halqat = await retrieveAllHalqat();
            halqatOptions = halqat.map(h => ({ value: h.id, text: h.name }));
            console.log("Halqat:", $state.snapshot(halqat));
        } catch (e) {
            alert("حدث خطأ أثناء تحميل الحلقات.");
            console.error(e);
        }
    }
    
    async function handleClickStudentButton(student) {
        window.location.href = `/examiner/student/${student.id}`
    }
</script>

<main>
    <Header>
        {#if examiner}
            <h1 style="margin-inline-start: 50px; font-size: 2em;">{examiner.fullName}</h1>
        {:else}
            <h1 style="margin-inline-start: 50px; font-size: 2em;">تحميل...</h1>
        {/if}
    </Header>

    <div class="content">
        <DropdownField 
            bind:value={selectedHalqaId} 
            labelWidth="100px" 
            label="الحلقة" 
            bind:options={halqatOptions} />

        <div style="height: 10px;"></div>

        {#if selectedHalqa}
            <div class="students-grid">
                {#if selectedHalqa.students?.length > 0}
                    {#each selectedHalqa.students as student}
                        <div 
                            onclick={() => handleClickStudentButton(student)}
                            onkeydown={() => {}}
                            role='button'
                            tabindex='0'
                            class="student-cell">
                            <p>{student.fullName}</p>
                        </div>
                    {/each}
                {:else}
                    <p class="no-students">لا يوجد طلاب في هذه الحلقة.</p>
                {/if}
            </div>
        {/if}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #f5f6f8;
    }

    .content {
        margin-top: 150px;
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
    }

    .students-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
        width: 100%;
        cursor: pointer;
    }

    .student-cell {
        background: white;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        transition: 0.2s ease;
    }

    .student-cell:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .no-students {
        color: #777;
        text-align: center;
        width: 100%;
    }
</style>
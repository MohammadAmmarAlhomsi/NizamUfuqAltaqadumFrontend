<script>
    import Header from '$lib/components/layout/Header.svelte';
    import Button from '$lib/components/Button.svelte';
    import dayjs from "dayjs";
    
    import "dayjs/locale/ar";
    
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { getUserData } from '$lib/sdk/auth';
    import { fetchPairedExaminer } from '$lib/sdk/examiner';
    import { getStudentById } from '$lib/sdk/student';
    import { deleteJuzuAccess, fetchAllJuzuAccesses, registerJuzuAccess } from '$lib/sdk/juzu-access';
    import { deleteJuzuAssessment, fetchStudentAssessments } from '$lib/sdk/juzu-assessment';
    import JuzuAssessmentForm from '$lib/components/forms/JuzuAssessmentForm.svelte';

    let examiner = $state(null);
    let studentId = $state(page.params.studentId);
    let student = $state(null);
    
    let showAssessment = $state(false);
    let assessmentJuzuNumber = $state(null);

    let openedAjzaRecords = $state([]);
    let assessedAjzaRecords = $state([]);

    let ajzaNumbers = Array.from({ length: 30 }, (_, i) => i + 1);
    let selectedJuzu = $state(null);
    let openedAjza = $state(new Set()); // stores opened juzʼ numbers
    let assessedAjza = $state(new Set()); // stores assessed juzʼ numbers

    let possibleToOpenJuzu = $state(false);
    let possibleToCloseJuzu = $state(false);
    let possibleToRegisterJuzuRecitation = $state(false);
    let possibleToDeleteJuzuRecitation = $state(false);

    dayjs.locale("ar");

    onMount(async () => {
        const userData = await getUserData();
        if (!userData) {
            window.location.href = `/signin`;
            return;
        }

        await loadExaminer();
        await loadStudent();
        await loadOpenedAjza();
        await loadAssessedAjza();
    });

    $effect(() => {
        if (selectedJuzu == null) {
            possibleToOpenJuzu =
                possibleToCloseJuzu =
                possibleToRegisterJuzuRecitation =
                possibleToDeleteJuzuRecitation = false;
            return;
        }

        possibleToOpenJuzu = 
            !assessedAjza.has(selectedJuzu) && 
            !openedAjza.has(selectedJuzu)

        possibleToCloseJuzu = 
            openedAjza.has(selectedJuzu);

        possibleToRegisterJuzuRecitation = 
            !assessedAjza.has(selectedJuzu) &&
            !openedAjza.has(selectedJuzu);

        possibleToDeleteJuzuRecitation = 
            assessedAjza.has(selectedJuzu);
    });

    async function loadExaminer() {
        try {
            examiner = await fetchPairedExaminer();
        } catch (e) {
            alert("حدث خطأ أثناء تحميل بيانات الممتحن.");
            console.error(e);
        }
    }

    async function loadStudent() {
        try {
            student = await getStudentById(studentId);
        } catch (e) {
            alert("حدث خطأ أثناء تحميل بيانات الطالب");
            console.error(e);
        }
    }

    async function loadOpenedAjza() {
        try {
            openedAjzaRecords = await fetchAllJuzuAccesses(studentId);
            if (openedAjzaRecords && Array.isArray(openedAjzaRecords)) {
                openedAjza = new Set(openedAjzaRecords.map(r => r.juzuNumber));
            }
        } catch (e) {
            console.error("Failed to load opened Ajza:", e);
        }
    }

    async function loadAssessedAjza() {
        try {
            assessedAjzaRecords = await fetchStudentAssessments(studentId);
            if (assessedAjzaRecords && Array.isArray(assessedAjzaRecords)) {
                assessedAjza = new Set(assessedAjzaRecords.map(a => a.juzuNumber));
            }
        } catch (e) {
            console.error("Failed to load assessed Ajza:", e);
        }
    }

    function selectJuzu(juzuNumber) {
        if (selectedJuzu != juzuNumber) {
            selectedJuzu = juzuNumber;
        } else {
            selectedJuzu = null;
        }
    }

    async function openJuzu() {
        if (!selectedJuzu) return alert("الرجاء اختيار جزء أولاً");

        if (openedAjza.has(selectedJuzu)) {
            alert(`الجزء رقم ${selectedJuzu} مفتوح مسبقًا.`);
            return;
        }

        try {
            const result = await registerJuzuAccess(selectedJuzu, studentId);
            if (result) {
                openedAjza.add(selectedJuzu);

                await loadOpenedAjza();
                selectJuzu(null);
            
            } else {
                alert("حدث خطأ أثناء فتح الجزء.");
            }
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء فتح الجزء.");
        }
    }

    async function closeJuzu() {
        let juzuAccessRecord = openedAjzaRecords.find(record => record.juzuNumber == selectedJuzu);
        if (juzuAccessRecord == null) {
            alert('لا يوجد سجل ليتم إغلاقه..');
            return;
        }

        try {
            await deleteJuzuAccess(juzuAccessRecord.id);
            await loadOpenedAjza();
            selectJuzu(null);
        } catch (e) {
            console.error(e);
            alert('حدث خطأ أثناء إغلاق الجزء.');
        }
    }

    async function deleteAssessmentRecord() {
        let juzuRecord = assessedAjzaRecords.find(r => r.juzuNumber == selectedJuzu);
        if (juzuRecord == null) {
            alert('لا يوجد سجل إختبار ليتم حذفه.');
        }

        try {
            await deleteJuzuAssessment(juzuRecord.id);
            await loadAssessedAjza();
            selectJuzu(null);
        } catch (e) {
            alert('حدث خطأ أثناء حفظ ')
            console.error(e);
        }
    }

    function makeAssessmentRecord() {
        if (!selectedJuzu) return alert("الرجاء اختيار جزء أولاً");
        assessmentJuzuNumber = selectedJuzu;
        showAssessment = true;
    }

    async function handleAssessmentSuccess(dto) {
        await loadAssessedAjza();
        selectJuzu(null);
        
    }

    function makeCompletionRecord() {
        if (!selectedJuzu) return alert("الرجاء اختيار جزء أولاً");
        alert(`إنشاء سجل إكمال للجزء ${selectedJuzu}`);
    }
</script>

<main>
    <Header>
        <h1 style="margin-inline-start: 50px; font-size: 2em;">
            {examiner?.fullName ?? 'تحميل...'}
        </h1>
        <div class="student-name">
            <h1>الطالب {student?.fullName ?? ''}</h1>
        </div>
    </Header>

    <div style="height: 90px;"></div>

    <div class="action-buttons">
        {#if possibleToOpenJuzu}<Button width='110px' onclick={openJuzu}>افتح الجزء</Button>{/if}
        {#if possibleToCloseJuzu}<Button width='110px' onclick={closeJuzu}>أغلق الجزء</Button>{/if}
        {#if possibleToRegisterJuzuRecitation}<Button width='110px' onclick={makeAssessmentRecord}>إختبار</Button>{/if}
        {#if possibleToDeleteJuzuRecitation}<Button width='110px' onclick={deleteAssessmentRecord}>إلغاء الإختبار</Button>{/if}
        
        <!-- <Button width='110px' onclick={makeCompletionRecord}>سجل الإكمال</Button> -->
    </div>

    <div class="ajza-container">
        <p class="ajza-title">الأجزاء</p>

        <div class="ajza-grid">
            {#each ajzaNumbers as juzuNumber}
                <div 
                    class="juzu-card 
                           {openedAjza.has(juzuNumber) ? 'opened' : ''} 
                           {assessedAjza.has(juzuNumber) ? 'assessed' : ''}
                           {selectedJuzu === juzuNumber ? 'selected' : ''}" 
                    onclick={() => selectJuzu(juzuNumber)}
                    role='button'
                    tabindex='0'
                    onkeydown={() => {}}
                >
                    {juzuNumber}

                    {#if assessedAjza.has(juzuNumber)}
                        <p style="font-size: 8px;">العلامة: {assessedAjzaRecords.find(r => r.juzuNumber == juzuNumber).grade}</p>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</main>

<JuzuAssessmentForm 
    bind:student={student} 
    bind:show={showAssessment} 
    bind:number={assessmentJuzuNumber} 
    onSuccess={handleAssessmentSuccess}
/>

<style>
    main {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #f5f6f8;
        padding-bottom: 50px;
        box-sizing: border-box;
    }

    .student-name {
        position: absolute;
        right: 50%;
        transform: translate(50%, 0);
    }

    .action-buttons {
        display: flex;
        gap: 15px;
        margin-bottom: 30px;
        align-items: center;
        height: 100px;
    }

    .ajza-container {
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 800px;
        gap: 20px;
    }

    .ajza-title {
        font-weight: bold;
        font-size: 1.2em;
    }

    .ajza-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        gap: 15px;
        width: 100%;
    }

    .juzu-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        padding: 15px;
        text-align: center;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
        height: 40px;
    }

    .juzu-card:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .juzu-card.selected {
        background-color: #ffeb3b; /* Yellow highlight */
        box-shadow: 0 4px 20px rgba(255,235,59,0.4);
        transform: scale(1.1);
    }

    .juzu-card.opened {
        background-color: #ffa726; /* Orange for opened */
        color: white;
        box-shadow: 0 4px 20px rgba(255,167,38,0.4);
    }

    .juzu-card.assessed {
        background-color: #66bb6a; /* Green for assessed */
        color: white;
        box-shadow: 0 4px 20px rgba(102,187,106,0.4);
    }
</style>

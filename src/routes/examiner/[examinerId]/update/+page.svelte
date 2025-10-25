<script>
    import Header from '$lib/components/layout/Header.svelte';
    import ExaminerDataForm from '$lib/components/forms/ExaminerDataForm.svelte';
    import Button from '$lib/components/Button.svelte';

    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { retrieveExaminerById, updateExaminer } from '$lib/sdk/examiner';
    // import { 
    //     get, 
    //     updateExaminer 
    // } from '$lib/sdk/examiner';
    import { page } from '$app/state';

    let examinerId = $state(page.params.examinerId);
    let examiner = $state(null);
    let data = $state({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        userId: '',
        notes: ''
    });
    
    onMount(async () => {
        const userData = await getUserData();
        if (!userData) {
            window.location.href = `/signin`;
            return;
        }

        try {
            data = await retrieveExaminerById(examinerId);
            console.log("Examiner loaded:", data);
        } catch (e) {
            alert("حدث خطأ أثناء جلب بيانات الممتحن. الرجاء المحاولة مرة أخرى.");
            console.error("Fetch error:", e);
        }
    });

    async function handleSubmit(data) {
        try {
            let { id, ...dto } = data;
            console.log("Updating examiner:", JSON.stringify(dto, null, 2));
            await updateExaminer(examinerId, dto);
            alert("تم تعديل الممتحن بنجاح!");
            window.history.back();
        } catch (error) {
            alert("حدث خطأ أثناء تعديل الممتحن. الرجاء المحاولة مرة أخرى.");
            console.error("Update error:", error);
        }
    }
</script>

<main>
    <Header>
        {#if data != null}
            <h1 style="margin-inline-start: 50px;">{data.fullName}</h1>
        {/if}
    </Header>

    <div class="container">
        <ExaminerDataForm bind:data={data} onsubmit={handleSubmit}/>
    </div>
</main>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }
</style>

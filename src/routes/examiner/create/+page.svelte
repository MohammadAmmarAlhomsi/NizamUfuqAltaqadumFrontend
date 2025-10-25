<script>
    import Header from '$lib/components/layout/Header.svelte';
    import ExaminerDataForm from '$lib/components/forms/ExaminerDataForm.svelte';
    import Button from '$lib/components/Button.svelte';

    import { getUserData as getUserDataAsync } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { registerExaminer } from '$lib/sdk/examiner';

    let userData = $state(null);

    onMount(async () => {
        userData = await getUserDataAsync();
        if (userData == null) {
            window.location.href = `/signin`;
        }
    });

    async function handleSubmit(data) {
        try {
            await registerExaminer(data);
            alert("تم إنشاء الممتحن بنجاح!");
            window.history.back();
        } catch (error) {
            alert("حدث خطأ أثناء إنشاء الممتحن. الرجاء المحاولة مرة أخرى.");
            console.error("Creation error:", error);
        }
    }
</script>

<main>
    <Header>
        <h1 style="margin-right: 50px">تسجيل مختبر جديد</h1>
    </Header>

    <div class="container">
        <ExaminerDataForm onsubmit={handleSubmit}/>
    </div>
</main>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }
</style>

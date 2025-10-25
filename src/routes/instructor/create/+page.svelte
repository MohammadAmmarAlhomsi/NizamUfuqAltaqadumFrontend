<script>
    import Header from '$lib/components/layout/Header.svelte';
    import InstructorDataForm from '$lib/components/forms/InstructorDataForm.svelte';
    import DateField from '$lib/components/DateField.svelte';
    import TabContainer from '$lib/components/TabsContainer.svelte';
    import InstructorsTable from '$lib/components/tables/InstructorsTable.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import HalaqatTable from '$lib/components/tables/HalaqatTable.svelte';
    import Button from '$lib/components/Button.svelte';

    import { getUserData as getUserDataAsync } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission, createInstructor } from '$lib/sdk/instructor';
    
    let date = $state('01-01-2010')
    let selectedTabIdx = $state(0);
    const tabs = $state([ { label: 'الطلاب', table: StudentsTable }, { label: 'الأساتذة', table: InstructorsTable }, { label: 'الحلقات', table: HalaqatTable} ])

    onMount(async () => {
        let userData = await getUserDataAsync();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }
    })

    async function handleSubmit(data) {
        try { await verifyCreateInstructorPermission();  }
        catch (error) {
            alert("ليس لديك إذن لإنشاء أستاذ جديد.");
            console.error("Permission error:", error);
            return;
        }

        try {
            await createInstructor(data);
            alert("تم إنشاء الأستاذ بنجاح!");
            window.history.back();
        } catch (error) {
            alert("حدث خطأ أثناء إنشاء الأستاذ. الرجاء المحاولة مرة أخرى.");
            console.error("Creation error:", error); 
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <InstructorDataForm onsubmit={handleSubmit}/>
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
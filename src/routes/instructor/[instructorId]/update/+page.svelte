<script>
    import Header from '$lib/components/layout/Header.svelte';
    import InstructorDataForm from '$lib/components/forms/InstructorDataForm.svelte';
    import DateField from '$lib/components/DateField.svelte';
    import TabContainer from '$lib/components/TabsContainer.svelte';
    import InstructorsTable from '$lib/components/tables/InstructorsTable.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import HalaqatTable from '$lib/components/tables/HalaqatTable.svelte';
    import Button from '$lib/components/Button.svelte';

    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission, createInstructor, getInstructorById, verifyUpdateInstructorPermission, updateInstructorAsync } from '$lib/sdk/instructor';
    import { page } from '$app/state';

    let instructorId = $state(page.params.instructorId);
    let instructor = $state(null);
    let data = $state({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        birthDate: new Date(),  
        emirate: '',
        region: '',
        notes: ''
    });
    
    onMount(async () => {
        let userData = await getUserData();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }

        try {
            data = await getInstructorById(instructorId);
            data.birthDate = new Date(data.birthDate);
            console.log(data);
        } catch (e) {
            alert("حدث خطأ أثناء جلب بيانات الأستاذ. الرجاء المحاولة مرة أخرى.");
            console.error("Fetch error:", e);
        }
    })

    async function handleSubmit(data) {
        try { await verifyUpdateInstructorPermission(instructorId);  }
        catch (error) {
            alert("ليس لديك الأذن للتعديل.");
            console.error("Permission error:", error);
            return;
        }

        try {
            let { id, ...dto } = data;
            console.log(JSON.stringify(dto, null, 2))
            await updateInstructorAsync(instructorId, dto);
            alert("تم تعديل الأستاذ بنجاح!");
            window.history.back();
        } catch (error) {
            alert("حدث خطأ أثناء تعديل الأستاذ. الرجاء المحاولة مرة أخرى.");
            console.error("Update error:", error); 
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <InstructorDataForm bind:data={data} onsubmit={handleSubmit}/>
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
<script>
    import Header from '$lib/components/layout/Header.svelte';
    import StudentDataForm from '$lib/components/forms/StudentDataForm.svelte';
    import DateField from '$lib/components/DateField.svelte';
    import TabContainer from '$lib/components/TabsContainer.svelte';
    import InstructorsTable from '$lib/components/tables/InstructorsTable.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import HalaqatTable from '$lib/components/tables/HalaqatTable.svelte';
    import Button from '$lib/components/Button.svelte';
    
    import { getUserData as getUserDataAsync } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { createStudent, verifyCreateStudentPermission } from '$lib/sdk/student';
    
    onMount(async () => {
        let userData = await getUserDataAsync();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }
    })

    async function handleSubmit(data) {
        try { await verifyCreateStudentPermission(data.halqaId);  }
        catch (error) {
            alert("ليس لديك إذن لتسجيل الطالب");
            console.error("Permission error:", error);
            return;
        }

        try {
            let { halqa, ...dto } = data;
            
            dto.birthDate = dto.birthDate instanceof Date ? 
                dto.birthDate.toISOString() :
                dto.birthDate;

            console.log(dto);
            await createStudent(dto);
            alert("تم إنشاء الطالب بنجاح!");
        } catch (error) {
            alert("حدث خطأ أثناء إنشاء الطالب. الرجاء المحاولة مرة أخرى.");
            console.error("Creation error:", error); 
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <StudentDataForm onsubmit={handleSubmit}/>
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
<script>
    import Header from '$lib/components/layout/Header.svelte';
    import StudentDataForm from '$lib/components/forms/StudentDataForm.svelte';
    import Button from '$lib/components/Button.svelte';

    import { getUserData } from '$lib/sdk/auth';
    import { getStudentById, updateStudentAsync, verifyUpdateStudentPermission } from '$lib/sdk/student';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { retrieveAllHalqat } from '$lib/sdk/halqa';
    import { fetchPairedInstructor, fetchResponsibleHalqat } from '$lib/sdk/instructor';

    let studentId = $state(page.params.studentId);
    let student = $state({
        id: "",                // Guid string
        fullName: "",
        fatherName: "",
        motherName: "",
        birthDate: "",          // ISO string: "YYYY-MM-DDTHH:mm:ssZ"
        nationality: "",
        school: "",
        phoneNumber: "",
        fatherPhoneNumber: "",
        motherPhoneNumber: "",
        fatherWork: "",
        motherWork: "",
        homeAddressId: "",
        emirate: "",
        region: "",
        halqaId: "",
        halqaName: ""
    });

    let instructor = null;
    
    onMount(async () => {
        let userData = await getUserData();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }

        try {
            student = await getStudentById(studentId);
            student.birthDate = new Date(student.birthDate);
            console.log($state.snapshot(student));
        } catch (e) {
            alert("حدث خطأ أثناء جلب بيانات الطالب. الرجاء المحاولة مرة أخرى.");
            console.error("Fetch error:", e);
        }
    })

    async function handleSubmit(data) {
        try { await verifyUpdateStudentPermission(studentId);  }
        catch (error) {
            alert("ليس لديك الأذن للتعديل.");
            console.error("Permission error:", error);
            return;
        }

        try {
            let { id, halqa, halqaName, ...dto } = data;
            console.log(JSON.stringify(dto, null, 2))
            await updateStudentAsync(studentId, dto);
            window.history.back();
            alert("تم تعديل الطالب بنجاح!");
        } catch (error) {
            alert("حدث خطأ أثناء تعديل الطالب. الرجاء المحاولة مرة أخرى.");
            console.error("Update error:", error); 
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <StudentDataForm bind:data={student} onsubmit={handleSubmit}/>
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
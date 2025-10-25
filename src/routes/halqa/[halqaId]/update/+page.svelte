<script>
    import Header from "$lib/components/layout/Header.svelte";
    import HalqaDataForm from "$lib/components/forms/HalqaDataForm.svelte";

    import { onMount } from "svelte";
    import { getUserData } from "$lib/sdk/auth";
    import { fetchHalqaById, updateHalqaAsync, verifyUpdateHalqaPermission } from "$lib/sdk/halqa";
    import { page } from "$app/state";

    let halqaId = $state(page.params.halqaId);
    let halqaData = $state({
        name: '',
        instructorId: '',
        instructor: null
    })

    onMount(async () => {
        let userData = await getUserData();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }

        try {
            halqaData = await fetchHalqaById(halqaId);
            console.log($state.snapshot(halqaData));
        } catch (e) {
            alert("حدث خطأ أثناء جلب بيانات الحلقة. الرجاء المحاولة مرة أخرى.");
            console.error("Fetch error:", e);
            window.location.href = `/signin`
        }
    });

    async function handleSubmit(data) {
        try { await verifyUpdateHalqaPermission(halqaId); }
        catch (error) {
            alert("ليس لديك الإذن للتعديل.");
            console.error("Permission error: ", error);
            return;
        }

        try {
            let {id, ...dto } = data;
            console.log(JSON.stringify(dto, null, 2));
            await updateHalqaAsync(halqaId, dto);
            alert("تم تعديل الحلقة بنجاح!");
            window.history.back();
        } catch (error) {
            alert("حدث خطأ أثناء تعديل الحلقة. الرجاء المحاولة مرة أخرى.");
            console.error("Update error:", error); 
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <HalqaDataForm bind:data={halqaData} onsubmit={handleSubmit}/>
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
<script>
    import Header from '$lib/components/layout/Header.svelte';

    import { getUserData } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { fetchPairedInstructor, fetchResponsibleHalqat } from '$lib/sdk/instructor';

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    let instructor = $state(null);
    let instructorId = $state(page.params.instructorId);

    let halqat = $state([]);

    onMount(async () => {
        let userData = await getUserData();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }

        try {
            instructor = await fetchPairedInstructor();
            instructor.birthDate = new Date(instructor.birthDate);
            console.log($state.snapshot(instructor));
        } catch (e) {
            alert("حدث خطأ أثناء جلب بيانات الأستاذ. الرجاء المحاولة مرة أخرى.");
            console.error("Fetch error:", e);
        }

        try {
            halqat = await fetchResponsibleHalqat();
            console.log($state.snapshot(halqat));
            if (halqat.length > 0) {
                window.location.href = `/halqa/${halqat[0].id}`
            }
        } catch (e) {
            console.error(e);
        }
    })
</script>

<main>
    <Header>
        <h1 style="margin-inline-start: 50px; font-size: 2em;">{instructor?.fullName}</h1>
    </Header>

</main>

<style>

    .attendance-days-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .attendance-day-button {
        padding: 10px;
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
        width: 1400px;
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
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(2px);
        z-index: 2;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

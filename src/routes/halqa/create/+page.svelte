<script>
    import Header from "$lib/components/layout/Header.svelte";
    import HalqaDataForm from "$lib/components/forms/HalqaDataForm.svelte";
    import { createHalqa } from "$lib/sdk/halqa";

    let errorText = $state('');

    async function handleSubmit(data) {
        try {
            let { instructor, ...dto } = data;
            console.log(dto);
            let halqaCreationResponse = await createHalqa(dto);
            console.log(halqaCreationResponse);
            window.history.back();
        } catch (e) {
            errorText = e;
            console.error(e);
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <HalqaDataForm onsubmit={handleSubmit}/>
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
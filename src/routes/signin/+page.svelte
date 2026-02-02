<script>
    import Header from '$lib/components/layout/Header.svelte';
    import SignInForm from '$lib/components/SignInForm.svelte';

    import { authorizeAccessToken, redirectToHomePage, signIn } from '$lib/sdk/auth';

    let errorText = $state('');
    let isLoading = $state(false);

    async function handleSubmit({ email, password }) {
        try {
            isLoading = true;
            let token = await signIn(email, password);
             
            redirectToHomePage();

            console.log(token.role.name);
        }
        catch (e) {
            errorText = e.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<main>
    <Header />
    {#if isLoading}
        <div class="loading">جارٍ تسجيل الدخول...</div>
    {:else}
        <SignInForm bind:errorText={errorText} onsubmit={handleSubmit}/>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .loading {
        font-weight: 600;
        color: #555;
    }
</style>

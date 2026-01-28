<script>
    import Header from '$lib/components/layout/Header.svelte';
    import SignInForm from '$lib/components/SignInForm.svelte';

    import { authorizeAccessToken, signIn } from '$lib/sdk/auth';

    let errorText = $state('');
    let isLoading = $state(false);

    async function handleSubmit({ email, password }) {
        try {
            isLoading = true;
            let token = await signIn(email, password);
            console.log(await authorizeAccessToken());
            
            let a = "";
            a.toLowerCase()
             
            if (token.role.name.toLowerCase() == 'instructor') {
                window.location.href = `/instructor`;
            } else if (token.role.name.toLowerCase() == 'admin') {
                window.location.href = `/director-dashboard`;
            } else if (token.role.name.toLowerCase() == 'examiner') {
                window.location.href = `/examiner`
            }
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

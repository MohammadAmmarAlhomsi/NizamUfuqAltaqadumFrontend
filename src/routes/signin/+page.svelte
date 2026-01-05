<script>
    import Header from '$lib/components/layout/Header.svelte';
    import SignInForm from '$lib/components/SignInForm.svelte';

    import { authorizeAccessToken, signIn } from '$lib/sdk/auth';

    let errorText = $state('');

    async function handleSubmit({ email, password }) {
        try 
        {
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
        catch (e)
        {
            errorText = e.message;
        }
    }
</script>

<main>
    <Header />
    <SignInForm bind:errorText={errorText} onsubmit={handleSubmit}/>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        min-height: 100vh;
        padding: 40px 16px 40px;
        box-sizing: border-box;
        gap: 28px;
    }
</style>

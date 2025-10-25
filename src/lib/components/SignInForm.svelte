<script>
    const { onsubmit = () => {}, errorText = $bindable() } = $props()

    let email = $state('')
    let password = $state('')

    function handleSubmit() {
        onsubmit({email, password});
    }
</script>

<main>
    <h1>تسجيل الدخول</h1>

    <div class="field-container">
        <p class="field-label">البريد</p>
        <input name="email" bind:value={email} type="text"/>
    </div>

    <div style="height: 20px;"></div>

    <div class="field-container">
        <p class="field-label">كلمة المرور</p>
        <input name="password" bind:value={password} type="password"/>
    </div>

    <p class="error-text">{errorText}</p>

    <div>
        <button onclick={handleSubmit} class="signin-button">تسجيل الدخول</button>
    </div>
</main>

<style>
    .error-text {
        height: 30px;
        margin: 10px 0px;
        color: red;
    }

    main {
        border: 1px solid black;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
    }

    h1 {
        margin-bottom: 20px;
    }

    input {
        outline: none;
        border: 1px solid black;
        border-radius: 10px;
        padding: 5px;
        width: 200px;
    }

    .field-container {
        display: flex;
        flex-direction: row;
    }

    .field-label {
        margin-left: 50px;
        width: 150px;
        text-align: start;
    }

    .signin-button {
        background: black;
        border: none;
        border-radius: 10px;
        color: white;
        padding: 10px;
        width: 100%;
        cursor: pointer;
    }

</style>
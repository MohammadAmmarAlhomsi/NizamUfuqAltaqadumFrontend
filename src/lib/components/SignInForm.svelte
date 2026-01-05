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
        width: min(440px, 100%);
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 24px 20px;
        text-align: center;
        background: #fff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    }

    h1 {
        margin-bottom: 16px;
        font-size: 1.4rem;
    }

    input {
        outline: none;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 10px 12px;
        width: 100%;
        box-sizing: border-box;
    }

    .field-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }

    .field-label {
        width: 100%;
        text-align: start;
        font-weight: 600;
        color: #111827;
    }

    .signin-button {
        background: #111827;
        border: none;
        border-radius: 12px;
        color: white;
        padding: 12px;
        width: 100%;
        cursor: pointer;
        font-weight: 700;
    }

    @media (max-width: 640px) {
        main {
            padding: 20px 16px;
            border-radius: 14px;
        }

        h1 {
            font-size: 1.2rem;
        }

        .signin-button {
            padding: 12px 10px;
        }
    }

</style>

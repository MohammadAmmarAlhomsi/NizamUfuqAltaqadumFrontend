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
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :root {
        --primary: #000;
        --border: #d1d1d1;
        --text: #222;
        --muted: #777;
        --error: #d32f2f;
        --radius: 15px;
    }

    main {
        width: 500px;
        margin: auto;
        padding: 28px 25px;
        border-radius: var(--radius);
        background: #fff;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
        text-align: center;
        direction: rtl;
    }

    h1 {
        margin-bottom: 24px;
        font-size: 22px;
        font-weight: 600;
        color: var(--text);
    }

    .field-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
        text-align: right;
    }

    .field-label {
        font-size: 14px;
        color: var(--muted);
        padding-right: 2px;
        color: black;
        font-weight: bold;
    }

    input {
        width: 100%;
        max-width: 100%;
        padding: 12px 14px;
        font-size: 15px;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        outline: none;
        background: #fff;
    }

    input:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
    }

    .error-text {
        min-height: 22px;
        margin: 8px 0 16px;
        font-size: 13px;
        color: var(--error);
        text-align: center;
        word-break: break-word;
    }

    .signin-button {
        width: 100%;
        max-width: 100%;
        padding: 12px;
        font-size: 15px;
        font-weight: 500;
        border-radius: var(--radius);
        border: none;
        background: var(--primary);
        color: #fff;
        cursor: pointer;
    }

    .signin-button:active {
        transform: scale(0.98);
    }
</style>

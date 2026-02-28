<script>
    import Header from '$lib/components/layout/Header.svelte';
    import Button from '$lib/components/Button.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { getWhatsAppStatus, getWhatsAppQr, startWhatsAppSession, stopWhatsAppSession } from '$lib/sdk/whatsapp';
    import { validateUserAccess } from '$lib/sdk/auth';

    let status = $state('STOPPED');
    let connected = $state(false);
    let phone = $state('');
    let pushName = $state('');
    let qrImage = $state('');
    let loading = $state(false);
    let errorMessage = $state('');

    /** @type {number | null} */
    let statusInterval = null;
    /** @type {number | null} */
    let qrInterval = null;

    onMount(async () => {
        await validateUserAccess();
        await refreshStatus();

        // Poll status every 5 seconds
        statusInterval = setInterval(refreshStatus, 5000);
    });

    onDestroy(() => {
        if (statusInterval) clearInterval(statusInterval);
        if (qrInterval) clearInterval(qrInterval);
    });

    async function refreshStatus() {
        const data = await getWhatsAppStatus();
        status = data.status || 'STOPPED';
        connected = data.connected || false;
        phone = data.phone || '';
        pushName = data.pushName || '';

        // If scanning QR, auto-refresh QR code
        if (status === 'SCAN_QR_CODE') {
            if (!qrInterval) {
                await refreshQr();
                qrInterval = setInterval(refreshQr, 20000);
            }
        } else {
            qrImage = '';
            if (qrInterval) {
                clearInterval(qrInterval);
                qrInterval = null;
            }
        }
    }

    async function refreshQr() {
        const data = await getWhatsAppQr();
        if (data) {
            qrImage = data.qr;
        }
    }

    async function handleStart() {
        loading = true;
        errorMessage = '';
        const success = await startWhatsAppSession();
        if (!success) {
            errorMessage = 'فشل في بدء جلسة واتساب';
        }
        // Wait a moment then refresh
        setTimeout(async () => {
            await refreshStatus();
            loading = false;
        }, 2000);
    }

    async function handleStop() {
        loading = true;
        errorMessage = '';
        const success = await stopWhatsAppSession();
        if (!success) {
            errorMessage = 'فشل في إيقاف جلسة واتساب';
        }
        await refreshStatus();
        loading = false;
    }

    function getStatusText(s) {
        switch (s) {
            case 'WORKING': return 'متصل';
            case 'SCAN_QR_CODE': return 'بانتظار مسح QR';
            case 'STARTING': return 'جاري البدء...';
            case 'STOPPED': return 'متوقف';
            case 'FAILED': return 'فشل';
            default: return s;
        }
    }

    function getStatusColor(s) {
        switch (s) {
            case 'WORKING': return '#28a745';
            case 'SCAN_QR_CODE': return '#ffc107';
            case 'STARTING': return '#17a2b8';
            case 'STOPPED': return '#6c757d';
            case 'FAILED': return '#dc3545';
            default: return '#6c757d';
        }
    }
</script>

<main>
    <Header>
        <div class="page-header">
            <div class="page-title">
                <span class="eyebrow">إدارة</span>
                <h1>واتساب</h1>
            </div>
        </div>
    </Header>

    <div class="header-spacer"></div>

    <div class="content">
        <div class="status-card">
            <h2>حالة الجلسة</h2>

            <div class="status-row">
                <span class="status-label">الحالة:</span>
                <span class="status-badge" style="background: {getStatusColor(status)}">
                    {getStatusText(status)}
                </span>
            </div>

            {#if connected && phone}
                <div class="status-row">
                    <span class="status-label">رقم الهاتف:</span>
                    <span class="status-value">{phone}</span>
                </div>
            {/if}

            {#if connected && pushName}
                <div class="status-row">
                    <span class="status-label">الاسم:</span>
                    <span class="status-value">{pushName}</span>
                </div>
            {/if}

            {#if errorMessage}
                <div class="error-message">{errorMessage}</div>
            {/if}

            <div class="actions">
                {#if status === 'STOPPED' || status === 'FAILED'}
                    <Button onclick={handleStart} disabled={loading}>
                        {loading ? 'جاري البدء...' : 'بدء الجلسة'}
                    </Button>
                {:else if status === 'WORKING'}
                    <Button onclick={handleStop} filled={false} disabled={loading}>
                        {loading ? 'جاري الإيقاف...' : 'إيقاف الجلسة'}
                    </Button>
                {:else if status === 'SCAN_QR_CODE'}
                    <Button onclick={handleStop} filled={false} disabled={loading}>
                        إلغاء
                    </Button>
                {/if}
            </div>
        </div>

        {#if status === 'SCAN_QR_CODE' && qrImage}
            <div class="qr-card">
                <h2>مسح رمز QR</h2>
                <p class="qr-instructions">افتح واتساب على هاتفك > الإعدادات > الأجهزة المرتبطة > ربط جهاز</p>
                <img src={qrImage} alt="WhatsApp QR Code" class="qr-image" />
                <p class="qr-refresh-note">يتم تحديث الرمز تلقائيا كل 20 ثانية</p>
            </div>
        {/if}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
    }

    .header-spacer {
        height: 110px;
        width: 100%;
    }

    .page-header {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        width: 100%;
        box-sizing: border-box;
    }

    .page-title {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .page-title h1 {
        margin: 0;
        font-size: 1.6rem;
    }

    .eyebrow {
        font-size: 0.85rem;
        color: #666;
        letter-spacing: 0.02em;
    }

    .content {
        width: 100%;
        max-width: 600px;
        padding: 0 24px;
        box-sizing: border-box;
    }

    .status-card, .qr-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 24px;
        margin-bottom: 24px;
    }

    .status-card h2, .qr-card h2 {
        margin: 0 0 16px 0;
        font-size: 1.2rem;
        text-align: center;
    }

    .status-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        font-size: 15px;
    }

    .status-label {
        font-weight: 600;
        min-width: 80px;
    }

    .status-badge {
        color: white;
        padding: 4px 14px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
    }

    .status-value {
        direction: ltr;
        font-family: monospace;
        font-size: 15px;
    }

    .error-message {
        color: #dc3545;
        background: #f8d7da;
        padding: 8px 14px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        text-align: center;
    }

    .actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 16px;
    }

    .qr-instructions {
        text-align: center;
        color: #666;
        font-size: 14px;
        margin-bottom: 16px;
    }

    .qr-image {
        display: block;
        margin: 0 auto;
        max-width: 280px;
        width: 100%;
        border-radius: 12px;
    }

    .qr-refresh-note {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 12px;
    }

    @media (max-width: 900px) {
        .header-spacer {
            height: 100px;
        }

        .page-header {
            justify-content: center;
            padding: 12px 16px;
        }

        .page-title {
            text-align: center;
            align-items: center;
        }
    }
</style>

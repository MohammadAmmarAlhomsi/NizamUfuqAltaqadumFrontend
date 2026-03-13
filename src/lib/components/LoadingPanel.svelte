<script>
    let { isActive = false } = $props();
</script>

{#if isActive}
    <div class="container">
        <img class="icon" src="/icons/loading-icon.svg" alt="">
    </div>
{/if}

<style>
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .container {
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon {
        height: 75px;
        animation: spin 1s linear infinite;
    }
</style>
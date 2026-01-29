<script>
    let { children } = $props();
</script>

<div class="container app-header">
    <div class="leading-spacer"></div>
    <div class="header-content">
        {@render children?.()}
    </div>
    <div class="flex-spacer"></div>
    <h1 class="app-title">نظام دورتنا</h1>
</div>

<style>
    .container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;

        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        box-sizing: border-box;
        padding-inline: 16px;
        max-width: 100vw;

        border-bottom: 2px solid black;
        background: rgba(255, 255, 255, 1);
        z-index: 1;
    }

    .leading-spacer {
        width: 50px;
    }

    .header-content {
        flex: 1 1 520px;
        min-width: 0;
    }

    .flex-spacer {
        flex: 1 1 auto;
    }

    .app-title {
        font-size: 2em;
        margin-inline-end: 50px;
        margin-inline-start: 10px;
        padding: 15px 0px;
        word-break: break-word;
    }

    @media (max-width: 900px) {
        .leading-spacer {
            width: 0;
        }

        .header-content {
            flex: 1 1 100%;
            order: 2;
        }

        .flex-spacer {
            display: none;
        }

        .app-title {
            width: 100%;
            text-align: center;
            margin: 0;
            padding: 10px 0;
            order: 1;
        }
    }
</style>

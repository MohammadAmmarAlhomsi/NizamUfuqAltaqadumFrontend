<script>
    let { children } = $props();
</script>

<div class="container">
    {@render children?.()}
    <div style="flex: 1;"></div>
    <h1 class="title">نظام دورتنا</h1>
</div>
<div class="header-spacer" aria-hidden="true"></div>

<style>
    :global(:root) {
        --header-height: 86px;
    }

    .container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;

        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;

        border-bottom: 2px solid black;
        background: rgba(255, 255, 255, 1);
        z-index: 1;
        padding: 12px 16px;
        box-sizing: border-box;
        flex-wrap: wrap;
    }

    .title {
        font-size: 2em;
        margin-inline-end: 24px;
        margin-inline-start: 10px;
        padding: 8px 0px;
        white-space: nowrap;
    }

    .header-spacer {
        height: var(--header-height);
        width: 100%;
    }

    @media (max-width: 768px) {
        :global(:root) {
            --header-height: 138px;
        }

        .container {
            justify-content: space-between;
            padding: 12px;
            gap: 10px;
        }

        .title {
            font-size: 1.4em;
            margin-inline: 0;
        }
    }

    @media (max-width: 480px) {
        :global(:root) {
            --header-height: 158px;
        }

        .title {
            font-size: 1.3em;
        }
    }
</style>

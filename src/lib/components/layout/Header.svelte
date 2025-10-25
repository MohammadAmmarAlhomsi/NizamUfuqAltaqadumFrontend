<script>
    let { children } = $props();
</script>

<div class="container">
    {@render children?.()}
    <div style="flex: 1;"></div>
    <h1>نظام دورتنا</h1>
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

        border-bottom: 2px solid black;
        background: rgba(255, 255, 255, 1);
        z-index: 1;
    }

    h1 {
        font-size: 2em;
        margin-inline-end: 50px;
        margin-inline-start: 10px;
        padding: 15px 0px;
    }
</style>
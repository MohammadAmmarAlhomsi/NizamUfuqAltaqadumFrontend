<script>
    import Button from "./Button.svelte";

    let { 
        callback=(isAccepted) => { },
        showOverlay=$bindable(false),
        ...props
    } = $props();

    function handleAccept() {
        showOverlay = false;
        callback(true);
    }

    function handleCancel() {
        showOverlay = false;
        callback(false);
    }
</script>

<div class="page-cancellation">
    <h2>إلغاء الصفحة</h2>
    <p>هل توافق على إلغاء وزن الصفحة 584؟</p>
    <div style="height: 10px;"></div>
    <div class="bottom-buttons">
        <Button onclick={handleAccept} filled={true} width='75px'>أوافق</Button>
        <div style="width: 10px;"></div>
        <Button onclick={handleCancel} filled={false} width='75px'>إلغاء</Button>
    </div>
</div>

<style>
    .bottom-buttons {
        display: flex;
        justify-content: center;
        align-content: center;
    }

    .page-cancellation {
        background: white;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border-radius: 20px;

        padding: 15px;

        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    }
</style>
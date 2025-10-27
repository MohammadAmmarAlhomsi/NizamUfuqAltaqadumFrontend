<script>
    import Button from "../Button.svelte";

    let { 
        startingNotes = '',
        student = null,
        onclickSave = (notes) => {},
        onclickCancel = () => {},
        ...props 
    } = $props();
    
    let notes = $state(startingNotes)

</script>

<div class="overlay">
    <div class="notes-menu">
        <h1>الملاحظات</h1>
        <p style="margin-bottom: 10px;"><b style="margin-inline-end: 10px;">الطالب:</b>{student?.fullName}</p>

        <textarea bind:value={notes} class="notes-textarea"></textarea>

        <div class="bottom-buttons">
            <div style="flex: 1;"><Button onclick={onclickCancel} width='100%' filled={false}>إلغاء</Button></div>
            <div style="width: 15px;"></div>
            <div style="flex: 1;"><Button onclick={() => { onclickSave(notes) }} width='100%'>حفظ</Button></div>
        </div>
    </div>
</div>

<style>
     h1 {
        width: 100%;
        text-align: center;
    }

    p { 
        width: 100%;
        text-align: start;
    }

     .bottom-buttons {
        width: 100%;
        display: flex;

    }
    
    .notes-textarea {
        width: 100%;
        outline: none;
        border: 1px solid black;
        border-radius: 10px;
        min-width: 250px;
        padding: 5px;
        box-sizing: border-box;
        margin-bottom: 15px;
        font-size: 16px;

        height: 150px;

        margin-bottom: 25px;
    }

    .notes-menu {
        background: white;
        width: 400px;
        border-radius: 15px;
        box-shadow: 0 0px 20px 0px rgba(0, 0, 0, 0.2);
        
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
    }

    .overlay {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
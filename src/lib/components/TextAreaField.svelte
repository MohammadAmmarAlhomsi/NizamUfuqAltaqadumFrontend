<script>
    let { label='LABEL', onsubmit=(t)=>{}, value=$bindable(), ...props } = $props()
</script>

<div class='container'>
    <p>{label}</p>
    <textarea onblur={onsubmit} bind:value={value}></textarea>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    p {
        margin-inline-end: 20px;
        width: 100px;
    }

    textarea {
        outline: none;
        border: none;
        border-radius: 10px;
        box-shadow: 0px 3px 3px 3px rgba(0, 0, 0, 0.11);
        min-width: 250px;
        padding: 5px;
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        font-size: 16px;
    }
</style>
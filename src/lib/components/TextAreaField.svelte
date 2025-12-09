<script>
    let { label='LABEL', fontSize='16px', labelWidth='100px', onsubmit=(t)=>{}, value=$bindable(), ...props } = $props()
</script>

<div class='container'>
    <p style={`width: ${labelWidth};`}>{label}</p>
    <textarea style={`font-size: ${fontSize}`} onblur={onsubmit} bind:value={value}></textarea>
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
    }
</style>
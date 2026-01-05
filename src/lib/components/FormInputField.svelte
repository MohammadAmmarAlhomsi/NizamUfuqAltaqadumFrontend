<script>
    let { 
        label='LABEL', 
        value=$bindable(),
        labelWidth='250px',
        inputMinWidth='250px',
        type='text',
         ...props 
    } = $props()
</script>

<div class='container'>
    <p style={`width: ${labelWidth}`}>{label}</p>
    <input {type} style={`min-width: ${inputMinWidth}`} bind:value={value} {...props}/>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    p {
        margin-inline-end: 20px;
        font-weight: 600;
    }

    input {
        outline: none;
        border: none;
        border-radius: 10px;
        box-shadow: 0px 3px 3px 3px rgba(0, 0, 0, 0.11);
        padding: 5px;
        width: 100%;
        max-width: 100%;
    }

    @media (max-width: 768px) {
        .container {
            flex-direction: column;
            align-items: flex-start;
        }

        p {
            margin: 0;
            width: 100% !important;
        }

        input {
            width: 100%;
            min-width: 0 !important;
        }
    }
</style>

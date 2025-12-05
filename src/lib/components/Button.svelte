<script>
    let { disabled=false, width = 'auto', filled = true, onclick = () => { }, children, ...props} = $props();
</script>

<button {...props} {disabled} 
    class:filled={filled}
    class:empty={!filled} onclick={(e) => {e.stopPropagation(); onclick();}}
    class:disabled={disabled}
    style={`cursor: ${!disabled ? 'pointer' : ''}; width: ${width}`}>
    {@render children?.()}
</button>

<style>
    button {
        color: white;
        background: black;
        border-radius: 30px;
        outline: none;
        border: none;
        padding: 10px 15px;
        box-sizing: border-box;
    }

    .filled {
        background: black;
        color: white;
    }

    .empty {
        background: white;
        border: 2px solid black;
        color: black;
    }

    .disabled {
        opacity: 30%;
    }
</style>
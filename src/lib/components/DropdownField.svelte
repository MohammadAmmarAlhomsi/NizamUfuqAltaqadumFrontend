<script>
    /** @typedef {{ text: str, value: object }} Option */

    /**
     * @type {{
     *      options: Array<Option>
     * }}
     */
    let { 
        label = 'LABEL', 
        value = $bindable(), 
        options = $bindable([]), 
        labelWidth = $bindable('250px'),
        inputMinWidth = $bindable('250px'),
        onchange = value => {},
        alignment = 'begin',
        zeroValue = '',
        ...props 
    } = $props();
</script>

<div class="container" 
    style={`justify-content: ${alignment}`}
    onclick={(e) => e.stopPropagation()} 
    role='button' 
    tabindex='0' 
    type='button'
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
        >
    <p style={`width: ${labelWidth}`}>{label}</p>
    <div class="select-container" style={`min-width: ${inputMinWidth}`}>
        <select onchange={onchange} bind:value={value} {...props}>
            <option value={zeroValue}>غير محدد</option>
            {#each options as option}
                <option value={option.value}>{option.text}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    .container {
        display: flex;
        align-items: center;

        box-sizing: border-box;
        cursor: pointer;
    }

    p {
        margin-inline-end: 20px;
        text-align: start;
        cursor: pointer;


        box-sizing: border-box;
    }

    .select-container {
        border-radius: 10px;
        box-shadow: 0px 3px 3px 3px rgba(0, 0, 0, 0.11);
        background-color: white; 
        cursor: pointer;

        padding: 3px;

        box-sizing: border-box;
    }

    select {
        outline: none;
        border: none;
        background: none;
        cursor: pointer;
        width: 100%;

        box-sizing: border-box;
    }
</style>

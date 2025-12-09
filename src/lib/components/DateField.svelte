<script>
    import flatpickr from "flatpickr";
    import "flatpickr/dist/flatpickr.css";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";
    dayjs.locale("ar");

    let { 
        label = "LABEL", 
        labelWidth = $bindable('100px'),
        value = $bindable(new Date()), 
        format = "dddd DD/MM/YYYY",
        ...props 
    } = $props();

    let fp;
    let inputRef;
    let buttonRef;

    let store = {
        hasChosen: false,
        selected: value
    };

    $effect(() => {
        if (!inputRef) return;

        fp = flatpickr(inputRef, {
            dateFormat: "Y-m-d",
            defaultDate: value,
            locale: "ar",

            // ⬇⬇⬇ Force calendar to appear near the button
            positionElement: buttonRef,  
            static: false,                // keep dropdown behavior

            ...props,

            onChange(selectedDates) {
                const d = selectedDates[0];
                if (d) {
                    store.hasChosen = true;
                    store.selected = d;
                    value = d;
                }
            }
        });

        return () => fp?.destroy();
    });

    $effect(() => {
        if (fp && value) fp.setDate(value, false);
    });
</script>

<div class="container">

    <p style={`width: ${labelWidth}`}>{label}</p>

    <input type="text" bind:this={inputRef} style="display:none;" />

    <button bind:this={buttonRef} onclick={() => fp.open()}>
        {#if store.hasChosen}
            {dayjs(store.selected).format(format)}
        {:else}
            {dayjs(value).format(format)}
        {/if}
    </button>

</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
    }

    p {
        margin-inline-end: 20px;
    }

    button {
        background: white;
        color: black;
        border: 0;
        padding: 5px 10px;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0px 3px 3px 3px rgba(0, 0, 0, 0.11);
        flex: 1;
        text-align: left;
        text-align: center;
    }

    button:hover {
        transform: scale(1);
    }
</style>

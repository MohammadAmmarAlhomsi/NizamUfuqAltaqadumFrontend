<script>
    import { Datepicker } from 'svelte-calendar';
    import dayjs from 'dayjs';
    import 'dayjs/locale/ar'

    let { label = 'LABEL', value = $bindable(new Date()), format = 'dddd DD/MM/YYYY', ...props } = $props();

    dayjs.locale("ar");

    const theme = {
        calendar: {
            colors: {
                background: {
                    highlight: 'black'
                }
            }
        }
    };

    let store;

    $effect(() => {
        if ($store?.hasChosen) {
            // keep as Date object
            value = new Date($store.selected);
        }
    });
</script>

<div class='container'>
    <p>{label}</p>
    <Datepicker {theme} bind:store let:key let:send let:receive>
        <button in:receive|local={{ key }} out:send|local={{ key }}>
            {#if $store?.hasChosen}
                <!-- format only for display -->
                {dayjs($store.selected).format(format)}
            {:else}
                <!-- show fallback -->
                {dayjs(value).format(format)}
            {/if}
        </button>
    </Datepicker>
</div>


<style>
    .container {
        display: flex;
        align-items: center;
        display: flex;
        flex-direction: row;
    }

    p {
        margin-inline-end: 20px;
        width: 150px;
    }

    button {
		background: rgb(255, 255, 255);
		color: #000;
		border: 0;
		padding: 5px 10px;
		font-size: 1.2em;
		border-radius: 6px;
		cursor: pointer;
        box-shadow: 0px 3px 3px 3px rgba(0, 0, 0, 0.11);
        font-size: 16px;
	}
</style>
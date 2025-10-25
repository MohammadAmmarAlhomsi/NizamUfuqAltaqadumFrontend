<script>
    let { 
        tabs = [ { label: 'نافذة 1' }, { label: 'نافذة 2' }, { label: 'نافذة 3' } ], 
        selectedIdx=$bindable(0), 
        ...props } = $props()

    function handleOnClickTab(tabIdx) {
        selectedIdx = tabIdx;
    }

</script>

<div class="container">
    {#each tabs as tab, i}
        <button 
            onclick={() => handleOnClickTab(i)} 
            class="tab"
            class:tab-selected={selectedIdx == i}
            class:tab-first={i == 0}
            class:tab-last={i==tabs.length - 1}
            >

            {tab.label}

        </button>
    {/each }
</div>

<style>
    * {
        margin: 0px;
        padding: 0px;
    }

    .container {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        border: 2px solid black;
        border-radius: 15px;
        padding: 0px 10px;
    }

    .tab {
        outline: none;
        border: none;
        padding: 10px;
        /* background: rgb(204, 204, 204); */
        background: none;
        opacity: 50%;
        cursor: pointer;
        font-weight: bold;
    }

    .tab-first {
        border-start-start-radius: 10px;
        border-end-start-radius: 10px;
    }

    .tab-last {
        border-start-end-radius: 10px;
        border-end-end-radius: 10px;
    }

    .tab-selected {
        transition: all ease-in-out 0.1s;
        text-decoration: underline;
        opacity: 100%;
    }
</style>
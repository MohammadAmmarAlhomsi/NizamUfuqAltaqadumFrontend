<script>
    import TableRenderer from "$lib/components/base-table/table-renderer.svelte";

    import { onMount } from "svelte";
    import { TableSection } from "./table-section.svelte";

    /** @type {{source: TableSection}}*/
    let { source = null } = $props();

    onMount(() => {
        source?.onMount();
    });
</script>

{#if source && source.Renderer != null}
    <source.Renderer source={source.table}/>
{/if}
<script>
    import { HalqaSummarySection } from "./halqa-summary-section.svelte";

    /** @type {{ source: HalqaSummarySection }}*/
    let { source = $bindable(null) } = $props(); 
</script>
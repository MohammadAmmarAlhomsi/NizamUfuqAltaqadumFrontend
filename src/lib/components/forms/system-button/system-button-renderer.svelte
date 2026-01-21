<script>
    import { SystemButton } from "./system-button.svelte";
    import styles from './system-button.module.css'

    /** @type {{ source: SystemButton }}*/
    let { source = null } = $props();
</script>

{#if source != null}
    <div class={styles.wrapper} tabindex="0" role="button">
        <div
            class={`${styles.button} ${source.disabled ? styles.disabled : ''}`}
            tabindex="0"
            role="button"
            onclick={() => source.invokeClick()}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") source.invokeClick();
            }}
        >
            {source.text}
        </div>
    </div>
{/if}

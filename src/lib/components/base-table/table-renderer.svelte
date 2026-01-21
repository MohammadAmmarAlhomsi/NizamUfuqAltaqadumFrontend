<script>
    import { render } from 'svelte/server';
    import { BaseTable, BaseTableElement } from './base-table.svelte';
    import styles from './base-table.module.css';
    import Button from '../Button.svelte';
    
    /** 
     * @template TElement
     * @typedef {import './base-table.svelte'.TableElementHeader<TElement>} TableElementHeader<TElement> */

    /** @type {{ source: BaseTable<any> }} */
    let { source = $bindable(null), children } = $props();

    /** @type {TableElementHeader<BaseTableElement>[]}*/
    let headers = $derived(
        source ? source.tableElementConstructor.getHeaders() : []
    );
</script>

{#snippet renderTableCell(item, header)}
    {#if header.Renderer}
        <header.Renderer source={header.rendererSource}/>
    {:else} 
        {@html header.render(item)}
    {/if}
{/snippet}

{#if source && headers.length}
<div class={styles.container}>
    <table class={styles.table}>
        <thead>
            <tr>
                <th></th>
                {#each headers as header}
                    <th>{header.displayName}</th>
                {/each}
                {#if source.tableElementConstructor.instructionButtons.length > 0}
                    <th>اوامر</th>
                {/if}
            </tr>
        </thead>
    
        <tbody>
            {#each source.elements as element, idx}
                <tr class={source.getRowStyleClass(element)}>
                    <td>{idx + 1}.</td>
                    {#each headers as header}
                        <td class={source.getColumnStyleClass(header, element)}>
                            {@render renderTableCell(element, header)}
                        </td>
                        <!-- <td>{@html header.render(element)}</td> -->
                    {/each}

                    {#if source.tableElementConstructor.instructionButtons.length > 0}
                        <td>
                            <div class={styles['buttons-container']}>
                                {#each source.tableElementConstructor.instructionButtons as instructionButton}
                                    <Button onclick={() => instructionButton.onclick(element)}>{instructionButton.getLabel()}</Button>
                                {/each}
                            </div>
                        </td>
                    {/if}
                </tr>
            {/each}
            {@render children?.()}
        </tbody>
    </table>
</div>
{:else}
<p class={styles.empty}>No data</p>
{/if}

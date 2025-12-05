<script>
    import styles from './page-recitation-box.module.css'

    import { PageRecitationBox } from './page-recitation-box.svelte';

    /** @type {{source: PageRecitationBox}} */
    let { source = $bindable(null) } = $props();
</script>

<button 
        onclick={source.handleClick} 
        class={[
            styles['recitation-page'], 
            styles[source.category],
            styles[source.isSelected ? 'is-selected' : ''],
            styles[source.isRecitedToday ? 'is-recited-today' : '']
        ]}
    >
    {source.quranPage?.number}
    
    <p class={styles["order-label"]}>{source.order}</p>
</button>
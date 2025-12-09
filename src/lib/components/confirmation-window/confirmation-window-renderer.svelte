<script>
    import Button from '$lib/components/Button.svelte';
    import styles from './confirmation-window.module.css';
    
    import { ConfirmationWindow } from "./confirmation-window.svelte";

    /** @type {{ source: ConfirmationWindow }} */
    let { source = $bindable(null) } = $props();
</script>

{#if source != null && source.isActive}
    <div class={styles['backdrop']}>
        <div class={styles['container']}>
            <h1 class={styles['title']}>تأكيد</h1>

            <p class={styles['message']}>{source.message}</p>

            <div class={styles['form-footer']}>
                <Button 
                    onclick={source.handleClickConfirm} 
                    filled={true} 
                    width='150px'
                >
                    تأكيد
                </Button>
                <Button 
                    onclick={source.handleClickCancel} 
                    filled={false} 
                    width='150px'
                >
                    إلغاء
                </Button>
            </div>
        </div>
    </div>
{/if}
<script>
    import Button from '$lib/components/Button.svelte';
    import styles from './whatsapp-notification.module.css';
    import { WhatsAppNotificationPopup } from './whatsapp-notification.svelte.js';

    /** @type {{ source: WhatsAppNotificationPopup }} */
    let { source = $bindable(null) } = $props();

    function getLabelText(label) {
        if (label === 'father') return 'الأب';
        if (label === 'mother') return 'الأم';
        return label;
    }

    function getStatusText(status) {
        switch (status) {
            case 'Pending': return 'في الانتظار...';
            case 'Sending': return 'جاري الإرسال...';
            case 'Sent': return 'تم الإرسال';
            case 'Failed': return 'فشل الإرسال';
            default: return status;
        }
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Pending': return styles['status-pending'];
            case 'Sending': return styles['status-sending'];
            case 'Sent': return styles['status-sent'];
            case 'Failed': return styles['status-failed'];
            default: return '';
        }
    }

    $effect(() => {
        // No-op read to track reactivity
        if (source) {
            source.recipientStatuses;
            source.sendState;
        }
    });
</script>

{#if source != null && source.isActive}
    <div class={styles['backdrop']}>
        <div class={styles['container']}>
            <h1 class={styles['title']}>إشعار واتساب</h1>
            <p class={styles['subtitle']}>إرسال إشعار غياب لولي أمر الطالب</p>

            <div class={styles['student-info']}>
                <b>الطالب:</b>{source.studentName}
            </div>

            {#if source.sendState === 'idle'}
                <!-- Message textarea -->
                <textarea 
                    class={styles['message-textarea']}
                    bind:value={source.message}
                ></textarea>

                <!-- Recipients checkboxes -->
                <div class={styles['recipients-section']}>
                    <div class={styles['recipients-title']}>المستلمون:</div>
                    
                    <div class={`${styles['recipient-row']} ${!source.fatherPhone ? styles['disabled'] : ''}`}>
                        <label>
                            <input 
                                type="checkbox" 
                                bind:checked={source.sendToFather}
                                disabled={!source.fatherPhone}
                            />
                            الأب - {source.fatherPhone || '(لا يوجد رقم)'}
                        </label>
                        {#if !source.fatherPhone}
                            <span class={styles['no-phone-hint']}>غير متوفر</span>
                        {/if}
                    </div>

                    <div class={`${styles['recipient-row']} ${!source.motherPhone ? styles['disabled'] : ''}`}>
                        <label>
                            <input 
                                type="checkbox" 
                                bind:checked={source.sendToMother}
                                disabled={!source.motherPhone}
                            />
                            الأم - {source.motherPhone || '(لا يوجد رقم)'}
                        </label>
                        {#if !source.motherPhone}
                            <span class={styles['no-phone-hint']}>غير متوفر</span>
                        {/if}
                    </div>
                </div>

                <!-- Buttons -->
                <div class={styles['form-footer']}>
                    <Button 
                        onclick={source.send} 
                        filled={true} 
                        width='140px'
                        disabled={(!source.sendToFather && !source.sendToMother)}
                    >
                        إرسال
                    </Button>
                    <Button 
                        onclick={source.skip} 
                        filled={false} 
                        width='140px'
                    >
                        تخطي
                    </Button>
                </div>

            {:else}
                <!-- Sending / Done status -->
                <div class={styles['status-section']}>
                    {#each source.recipientStatuses as recipient}
                        <div class={`${styles['status-row']} ${getStatusClass(recipient.status)}`}>
                            <span class={styles['status-label']}>
                                {getLabelText(recipient.label)} - {recipient.phone}
                            </span>
                            <span class={styles['status-badge']}>
                                {#if recipient.status === 'Sending' || recipient.status === 'Pending'}
                                    <span class={styles['spinner']}></span>
                                {/if}
                                {getStatusText(recipient.status)}
                            </span>
                        </div>
                        {#if recipient.errorMessage}
                            <div style="font-size: 12px; color: #721c24; padding: 0 12px 6px;">
                                {recipient.errorMessage}
                            </div>
                        {/if}
                    {/each}
                </div>

                {#if source.sendState === 'done'}
                    <div class={styles['form-footer']}>
                        <Button 
                            onclick={source.close} 
                            filled={true} 
                            width='140px'
                        >
                            إغلاق
                        </Button>
                    </div>
                {:else}
                    <p style="font-size: 14px; color: #666; text-align: center;">
                        جاري الإرسال... يرجى الانتظار
                    </p>
                {/if}
            {/if}
        </div>
    </div>
{/if}

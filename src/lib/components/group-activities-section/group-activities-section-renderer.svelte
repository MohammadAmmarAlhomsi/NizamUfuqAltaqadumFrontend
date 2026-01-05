<script>
    import styles from './group-activities-section.module.css'

    import Button from "../Button.svelte";
    import GroupActivityFormRenderer from "../forms/group-activity-form/group-activity-form-renderer.svelte";
    import ConfirmationWindowRenderer from '../confirmation-window/confirmation-window-renderer.svelte';

    import { onMount } from "svelte";
    import { GroupActivitiesSection } from "./group-activities-section.svelte";
    import { formatArabicDate } from '../../../utilities/util';
    
    /** @type {{ source: GroupActivitiesSection }}*/
    let { source = $bindable(null) } = $props();

    onMount(() => {
        source.onMount();
    });
</script>

{#if source != null}
    <div class={styles["activities-shell"]}>
        <Button onclick={source.handleClickAddNew}>إضافة نشاط جديد</Button>

        <div style="height: 18px;"></div>
        
        <div class={styles['group-activity-container']}>
            {#each source.groupActivities as groupActivity}
                <div 
                        role="button"
                        tabindex="0"
                        onclick={() => source.handleClickGroupActivity(groupActivity)}
                        onkeydown={ch => {}}
                        class={styles['group-activity-cell']}>
                    <p><b>{groupActivity.name}</b></p>
                    <p>{formatArabicDate(groupActivity.happenedAt)}</p>

                    <button onclick={(e) => { e.stopPropagation(); source.handleClickDelete(groupActivity) }} class={styles['delete-button']}><img class={styles['button-icon']} src="/icons/delete-icon.png" alt=""></button>
                </div>
            {/each}
        </div>

        {#if source.groupActivityForm?.isActive}
            <GroupActivityFormRenderer bind:source={source.groupActivityForm}/>
        {/if}

        <ConfirmationWindowRenderer bind:source={source.confirmationWindow}/>
    </div>
{/if}

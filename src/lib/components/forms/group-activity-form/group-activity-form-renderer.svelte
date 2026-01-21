<script>
    import Button from '$lib/components/Button.svelte';
    import DateField from '$lib/components/DateField.svelte';
    import DropdownField from '$lib/components/DropdownField.svelte';
    import FormInputField from '$lib/components/FormInputField.svelte';
    import TextAreaField from '$lib/components/TextAreaField.svelte';
    import styles from './group-activity-form.module.css';
    
    import { GroupActivityForm } from "./group-activity-form.svelte";
    import { onMount } from 'svelte';

    /** @type {{ source: GroupActivityForm }} */
    let { source = $bindable(null) } = $props();

    onMount(() => {
        source.onMount();
    })
</script>

<div class={styles['container']}>
    {#if source != null && source.groupActivity != null}
        <h1 class={styles['title']}>نشاط</h1>

        <FormInputField bind:value={source.groupActivity.name} labelWidth='150px' label="اسم النشاط"/>
        <DropdownField bind:value={source.groupActivity.attendanceDayId} labelWidth='150px' options={source.attendanceDaysOptions} label='التاريخ'/>
        <TextAreaField fontSize='auto' bind:value={source.groupActivity.notes} labelWidth='150px' label="الملاحظات"/>

        <div class={styles['error-text-container']}> 
            <p class={styles['error-text']}>{source.errorMessage}</p>
        </div>

        <div class={styles['students-container']}>
            {#each source.groupActivity.weights as weight, i}
                <div class={styles['weight-element']} >
                    <p>{source.getStudentName(weight.studentId)}</p>
                    <div style="flex: 1"></div>
                    <input 
                        bind:value={source.groupActivity.weights[i].weight}
                        class={styles['weight-element-number-field']} 
                        type="number">
                </div>
            {/each}
        </div>

        <div class={styles['form-footer']}>
            <Button onclick={source.handleClickSubmit} filled={true} width='150px'>حفظ</Button>
            <Button onclick={source.handleClickCancel} filled={false} width='150px'>إلغاء</Button>
        </div>
    {:else}
        <p>لا يوجد سجل موجود</p>
    {/if}
</div>
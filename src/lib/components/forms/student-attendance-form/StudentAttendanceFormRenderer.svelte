<script>
    import styles from './student-attendance-form-style.module.css'

    import DropdownField from '$lib/components/DropdownField.svelte';
    import PageRecitationBoxRenderer from '$lib/components/page-recitation-box/PageRecitationBoxRenderer.svelte';
    import Button from '$lib/components/Button.svelte';
    import TextAreaField from '$lib/components/TextAreaField.svelte';
    
    import { StudentAttendanceForm } from './student-attendance-form.svelte';
    import { onMount } from 'svelte';

    /** @type {{
     * studentAttendanceRecord: StudentAttendanceRecord
    }}*/
    let { studentAttendanceRecord = $bindable(null) } = $props();

    let source = $state(new StudentAttendanceForm());
    source.initialize(studentAttendanceRecord);

    $effect(async () => {
        source.studentAttendanceRecord = studentAttendanceRecord;
        await source.load();
    })
</script>

<div class={styles["container"]}>
    <div style="height: 20px;"  ></div>

    {#if source.studentAttendanceRecord != null}
        <DropdownField
            label="الحضور"
            options={source.attendanceOptions}
            bind:value={source.studentAttendanceRecord.status}
            zeroValue={null}
        />

        <div style="height: 30px;"></div>

        {#if source.pagesBoxes.length > 0 && source.showPageBoxes}

            <div class={styles["selection-action-container"]}>
                {#if source.currentSelectionCategory != null}
                    {#each source.currentSelectionCategory.behaviours as behaviour} 
                        <Button onclick={async () => await behaviour.func()}>{behaviour.name}</Button>
                    {/each}
                {/if}
            </div>

            <div style="display: flex;">
                <p><b>الحفظ:</b></p>
                <div style="flex: 1"></div>
                <div><b>الجزء {source.quranPages[0].juzuNumber}</b></div>
            </div>
            <div style="height: 10px;"></div>

            <div class={styles["pages-container"]}>
                {#each source.pagesBoxes as pageBox, i}
                    <PageRecitationBoxRenderer bind:source={source.pagesBoxes[i]} />
                {/each}
            </div>
        {/if}

        <div style="height: 100px; margin-bottom: 30px">
            <TextAreaField bind:value={source.studentAttendanceRecord.notes} label="الملاحظات" />
        </div>
    {:else}
            لم يتم تنزيل سجل الطالب!
    {/if}

    <div class={styles["save-button-container"]}>
        <Button onclick={source.submit}>حفظ</Button>
    </div>
</div>
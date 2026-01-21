<script>
    import { StudentRecordPage } from "./student-record-page.svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { SystemButton } from "$lib/components/forms/system-button/system-button.svelte";
    
    import Header from "$lib/components/layout/Header.svelte";
    import TableRenderer from "$lib/components/base-table/table-renderer.svelte";
    import SystemButtonRenderer from "$lib/components/forms/system-button/system-button-renderer.svelte";
    
    import styles from "./student-record-page.module.css";

    let studentId = $state(page.params.studentId);
    let sourcePage = new StudentRecordPage(studentId);
    
    let button = $state(new SystemButton('اضغط هنا!'));
    button.addEventListener('click', () => {
        alert('hi there!!!');
    })

    onMount(async () => {
        await sourcePage.onMount();
    });
</script>

<div class={styles['container']}>
    {#if sourcePage?.student}
        <Header>
            <h1>{sourcePage.student.fullName}</h1>
        </Header>

        <div style="height: 150px;"></div>

        <div class={styles['table-container']}>
            <div style="height: 150px;"></div>
            <TableRenderer bind:source={sourcePage.table}/>
            <div style="height: 50px;"></div>
        </div>
    {/if}
</div>

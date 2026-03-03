<script>
    import { StudentRecordPage } from "./student-record-page.svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import Button from "$lib/components/Button.svelte";
    import Header from "$lib/components/layout/Header.svelte";
    import TableRenderer from "$lib/components/base-table/table-renderer.svelte";
    import StudentsSummariesTableRenderer from "$lib/components/students-summaries-table/students-summaries-table-renderer.svelte";

    import styles from "./student-record-page.module.css";

    let studentId = $state(page.params.studentId);
    let sourcePage = new StudentRecordPage(studentId);
    
    onMount(async () => {
        await sourcePage.onMount();
    });

    async function handleExportPdf() {
        if (!sourcePage?.student) return;
        await sourcePage.student.getRecordPdf();
    }
</script>

    <div class={styles['container']}>
    {#if sourcePage?.student}
        <Header>
            <div class={styles['header-row']}>
                <h1>{sourcePage.student.fullName}</h1>
                <Button onclick={handleExportPdf}>تصدير PDF</Button>
            </div>
        </Header>

        <div style="height: 150px;"></div>

        <div class={styles['table-container']}>
            <div style="height: 150px;"></div>
            <!-- <div>
                <h2>الملخص الكامل</h2>
            </div> -->

            <div>
                <h2 style="margin-bottom: 15px; text-align: center;">الملخص العام</h2>
                <StudentsSummariesTableRenderer source={sourcePage.studentSummariesTable}/>
            </div>

            <div style="height: 50px;"></div>

            <div>
                <h2 style="margin-bottom: 15px; text-align: center;">الإختبارات</h2>
                <TableRenderer bind:source={sourcePage.juzuAssessmentTable}/>
            </div>

            <div style="height: 50px;"></div>

            <div>
                <h2 style="margin-bottom: 15px; text-align: center;">كشف أيام الحضور</h2>
                <TableRenderer bind:source={sourcePage.attendanceSummaryTable}>
                    <tr style="background: black; color: white">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{sourcePage.totalActivitiesPoints}</td>
                        <td>{sourcePage.totalRecitationPoints}</td>
                        <td>{sourcePage.totalAttendancePoints}</td>
                        <td>{sourcePage.totalPoints}</td>
                    </tr>
                </TableRenderer>
            </div>
            <div style="height: 50px;"></div>
            
        </div>
    {/if}
</div>

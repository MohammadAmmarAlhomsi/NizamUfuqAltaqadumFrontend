<script>
    import { StudentsSummariesTable } from "./students-summaries-table.svelte";
    import { onMount } from "svelte";
    
    import styles from './students-summaries-table.module.css';

    /** @type {{ source: StudentsSummariesTable }} */
    let { source = null } = $props();

    onMount(() => {
        source?.onMount();
    });
</script>

<div class={styles.container}>
    <table class={styles.table}>
        <thead>
            <tr>
                <th>الطالب</th>   
                <th>مجموع النقاط</th>
                <th colspan="5">الحضور</th>
                <th colspan="3">الحفظ</th>
                <th>النشاط</th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                <th>تام</th>
                <th>متأخر</th>
                <th>غياب بعذر</th>
                <th>غياب بدون</th>
                <th>المجموع</th>
                <th>عدد الأجزاء</th>
                <th>عدد الصفحات</th>
                <th>المجموع</th>
                <th>المجموع</th>
            </tr>
        </thead>

        <tbody>
            {#each source.summaries as summary, idx}
                <tr 
                    onclick={() => source.handleClickSummary(summary)}>
                    <td style="border-inline-end: 1px dotted black;">{summary.student.fullName}</td>
                    <td style="border-inline-end: 1px dotted black;">{summary.totalPoints}</td>

                    <td>{summary.studentAttendanceSummary.attendanceCount}</td>
                    <td>{summary.studentAttendanceSummary.lateAttendanceCount}</td>
                    <td>{summary.studentAttendanceSummary.abscentWithExecuseCount}</td>
                    <td>{summary.studentAttendanceSummary.abscentWithoutExecuseCount}</td>
                    <td style="border-inline-end: 1px dotted black;">{summary.studentAttendanceSummary.totalPoints}</td>

                    <td>{summary.studentMemorizationSummary.assessedAjzaCount}</td>
                    <td>{summary.studentMemorizationSummary.recitedPagesCount}</td>
                    <td style="border-inline-end: 1px dotted black;">{summary.studentMemorizationSummary.totalRecitationPagePoints + summary.studentMemorizationSummary.totalJuzuAssessmentPoints}</td>

                    <td>{summary.studentActivitySummary.totalPoints}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

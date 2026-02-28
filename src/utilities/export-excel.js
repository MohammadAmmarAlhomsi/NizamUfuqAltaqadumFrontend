import * as XLSX from 'xlsx';

/**
 * Exports halqa students summary as Excel
 * @param {Array} summaries
 * @param {string} halqaName
 */
export function exportSummaryExcel(summaries, halqaName) {
    const headerRow1 = [
        'الطالب',
        'مجموع النقاط',
        'الحضور', '', '', '', '',
        'الحفظ', '', '',
        'النشاط'
    ];

    const headerRow2 = [
        '', '',
        'تام', 'متأخر', 'غياب بعذر', 'غياب بدون', 'المجموع',
        'عدد الأجزاء', 'عدد الصفحات', 'المجموع',
        'المجموع'
    ];

    const dataRows = (summaries || []).map(summary => {
        const att = summary.studentAttendanceSummary;
        const mem = summary.studentMemorizationSummary;
        const act = summary.studentActivitySummary;
        return [
            summary.student?.fullName || '',
            summary.totalPoints,
            att.attendanceCount,
            att.lateAttendanceCount,
            att.abscentWithExecuseCount,
            att.abscentWithoutExecuseCount,
            att.totalPoints,
            mem.assessedAjzaCount,
            mem.recitedPagesCount,
            mem.totalRecitationPagePoints + mem.totalJuzuAssessmentPoints,
            act.totalPoints
        ];
    });

    const worksheetData = [headerRow1, headerRow2, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    ws['!merges'] = [
        { s: { r: 0, c: 2 }, e: { r: 0, c: 6 } },
        { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } }
    ];

    ws['!cols'] = [
        { wch: 26 },
        { wch: 14 },
        { wch: 8 },
        { wch: 8 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ملخص الحلقة');

    const safeName = (halqaName || 'الحلقة').replace(/\s+/g, '_');
    XLSX.writeFile(wb, `ملخص_${safeName}.xlsx`, { compression: true });
}

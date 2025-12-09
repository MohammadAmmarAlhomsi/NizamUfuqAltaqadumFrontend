import { HalqaAttendanceRecord, HalqaAttendanceSummary } from "$lib/sdk/models/halqa-attendance-record.svelte";

/** 
 * @typedef StatParagraphStyle 
 * @property {String} attendanceState
 * @property {String} textColor
 * @property {String} spanColor
*/

export class HalqaAttendanceSummaryCell {

    /** @param {HalqaAttendanceRecord} */
    constructor(halqaAttendanceRecord) {

        /** @type {HalqaAttendanceRecord} */

        this.halqaAttendanceRecord = $state(halqaAttendanceRecord);
        const date = new Date(this.halqaAttendanceRecord.attendanceDay.date);
        this.dayName = $state(date.toLocaleDateString("ar", { weekday: "long" }));

        this.dateFormatted = $state(date.toLocaleDateString("en-GB"));

        /** @type {HalqaAttendanceSummary} */
        this.summary = $state(null);

        /** @type {StatParagraphStyle[]} */
        this.statsParagraphsStyles = [
            { attendanceState: 'Attended', textColor: '#27ae60', spanColor: '#4cbc7b' },
            { attendanceState: 'AttendedLate', textColor: '#a9e2b4', spanColor: '#b7e7c0' },
            { attendanceState: 'AbscentWithExecuse', textColor: '#f5d658', spanColor: '#f1c40f' },
            { attendanceState: 'AbscentWithoutExecuse', textColor: '#e74c3c', spanColor: '#e74c3c' },
            { attendanceState: '', textColor: '#000000', spanColor: '#ffffff' },
        ]
    }

    onMount = async () => {
        await this.load();
    }

    handleClick = () => {
        window.location.href = `/halqa/${this.halqaAttendanceRecord.halqaId}/attendance/${this.halqaAttendanceRecord.id}`;
    }
}
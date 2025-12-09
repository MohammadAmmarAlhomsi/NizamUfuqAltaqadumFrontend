import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
import { AttendanceDay } from "$lib/sdk/models/attendance-day.svelte";
import { Halqa } from "$lib/sdk/models/halqa.svelte";
import { HalqaAttendanceSummaryCell } from "../halqa-attendance-summary-cell/halqa-attendance-summary-cell.svelte";

export class FollowUpSection {

    /** @param {String} halqaId */
    constructor(halqaId) {

        /** @type {String} */
        this.halqaId = $state(halqaId);

        /** @type {Halqa} */
        this.halqa = $state(null);

        /** @type {HalqaAttendanceRecord[]} */ 
        this.halqaAttendanceRecords = $state([]);

        /** @type {Boolean} */
        this.showBaseHalqaInitiatior = $state(false);

        /** @type {HalqaAttendanceSummaryCell[]} */
        this.halqaAttendanceCells = $state([]);
    }

    onMount = async () => {
        await this.load();
    }

    /** @param {AttendanceDay} day */
    handleCreateHalqaAttendance = async (day) => {
        this.handleCloseForm();

        let halqaAttendanceRecord = new HalqaAttendanceRecord(this.halqaId, day.id, '');
        let response = await halqaAttendanceRecord.save();
        if (response.succeed == false) {
            alert('حدث خطأ أثناء إنشاء سجل الحلقة');
        } else {
            await this.load();
        }
    }

    handleOpenForm = () => {
        this.showBaseHalqaInitiatior = true;
    }

    handleCloseForm = () => {
        this.showBaseHalqaInitiatior = false;
    }

    load = async () => {
        this.halqa = await Halqa.getById(this.halqaId);
        this.halqaAttendanceRecords = await HalqaAttendanceRecord.getHalqaAttendanceRecords(this.halqaId);
        await HalqaAttendanceRecord.includeHalqaStudentMissingRecords(this.halqa.id);
        let summaries = await HalqaAttendanceRecord.getHalqaAttendanceSummaries(this.halqa.id);
        let summariesDict = Object.fromEntries(
            summaries.map(summary => [summary.halqaAttendanceRecordId, summary])
        );

        this.halqaAttendanceCells = this.halqaAttendanceRecords.map(record => new HalqaAttendanceSummaryCell(record))
        this.halqaAttendanceCells.forEach(cell => cell.summary = summariesDict[cell.halqaAttendanceRecord.id]);
    }
}
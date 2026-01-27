import { getUserData, validateUserAccess } from "$lib/sdk/auth";
import { AttendanceDay } from "$lib/sdk/models/attendance-day.svelte";
import { Student } from "$lib/sdk/models/student.svelte";
import { goToSignin } from "../../../../utilities/util";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { StudentAttendanceDaySummaryTableElement } from "$lib/components/student-attendance-summary-table/student-attendance-summary-table.svelte";
import { StudentsSummariesTable } from "$lib/components/students-summaries-table/students-summaries-table.svelte";
import { JuzuAssessmentTableElement } from "$lib/components/tables-elements/juzu-assessment-table-element.svelte";

import styles from './student-record-page.module.css'

export class StudentRecordPage {
    constructor(studentId) {
        this.userData = $state(null);
        
        /** @type {Student} */ 
        this.student = $state(null);

        /** @type {StudentsSummariesTable} */
        this.studentSummariesTable = $state(new StudentsSummariesTable());

        /** @type {String} */
        this.studentId = studentId;

        /** @type {BaseTable<StudentAttendanceDaySummaryTableElement>} */
        this.attendanceSummaryTable = $state(null);

        /** @type {int} */ this.totalPoints = $state(0);
        /** @type {int} */ this.totalRecitationPoints = $state(0);
        /** @type {int} */ this.totalAttendancePoints = $state(0);
        /** @type {int} */ this.totalActivitiesPoints = $state(0);

        /** @type {BaseTable<JuzuAssessmentTableElement>} */
        this.juzuAssessmentTable = $state(null);
    }

    onMount = async () => {
        this.userData = await validateUserAccess();
        this.student = await Student.getById(this.studentId);

        let studentSummary = await this.student.getSummary();
        this.studentSummariesTable.summaries = [studentSummary];

        this.juzuAssessmentTable = new BaseTable(JuzuAssessmentTableElement);
        let juzuAssessmentRecords = await this.student.getAssessedAjza();
        this.juzuAssessmentTable.elements = juzuAssessmentRecords.map(r => new JuzuAssessmentTableElement(r));

        await this.setupAttendanceDaySummaryTable();
    }

    setupAttendanceDaySummaryTable = async () => {
        let records = await this.student.getAttendanceDaySummaries();
        console.log(records);

        this.attendanceSummaryTable = new BaseTable(StudentAttendanceDaySummaryTableElement);
        this.attendanceSummaryTable.getRowStyleClass = element => {
            if (element.summary.attendanceStatus == 'Attended') return styles['attended'];
            if (element.summary.attendanceStatus == 'AttendedLate') return styles['attended-late'];
            if (element.summary.attendanceStatus == 'AbscentWithExecuse') return styles['absence-with-excuse'];
            if (element.summary.attendanceStatus == 'AbscentWithoutExecuse') return styles['absence-without-excuse'];
            return null;
        }
        this.attendanceSummaryTable.getColumnStyleClass = (header, element) => {
            if (header.displayName == StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_POINTS_COLUMN_DISPLAY_NAME) {
                return styles['total-points-column']
            } else if (
                header.displayName == StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_MEMORIZATION_POINT_COLUMN_DISPLAY_NAME ||
                header.displayName == StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_ATTENDANCE_POINT_COLUMN_DISPLAY_NAME ||
                header.displayName == StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_ACTIVITIES_POINT_COLUMN_DISPLAY_NAME) {
                return styles['start-dashed'];
            }
            return null;
        }

        this.attendanceSummaryTable.elements = records.map(r => new StudentAttendanceDaySummaryTableElement(r));

        this.totalAttendancePoints = this.attendanceSummaryTable.elements
            .map(element => element.summary.attendancePoints)
            .reduce((x1, x2) => x1 + x2, 0);

        this.totalRecitationPoints = this.attendanceSummaryTable.elements
            .map(element => element.summary.pageRecitationPointsRecords.map(r => r.points).reduce((x1, x2) => x1 + x2, 0))
            .reduce((x1, x2) => x1 + x2, 0);

        this.totalActivitiesPoints = this.attendanceSummaryTable.elements
            .map(element => element.summary.indivsualActivities.map(r => r.weight).reduce((x1, x2) => x1 + x2, 0))
            .reduce((x1, x2) => x1 + x2, 0);

        this.totalPoints = this.totalAttendancePoints + this.totalRecitationPoints + this.totalActivitiesPoints;
    }
}
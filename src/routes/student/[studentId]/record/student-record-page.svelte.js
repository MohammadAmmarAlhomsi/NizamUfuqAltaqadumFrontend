import { getUserData, validateUserAccess } from "$lib/sdk/auth";
import { AttendanceDay } from "$lib/sdk/models/attendance-day.svelte";
import { Student } from "$lib/sdk/models/student.svelte";
import { goToSignin } from "../../../../utilities/util";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { StudentAttendanceDaySummaryTableElement } from "$lib/components/student-attendance-summary-table/student-attendance-summary-table.svelte";
import styles from './student-record-page.module.css'

export class StudentRecordPage {
    constructor(studentId) {
        this.userData = $state(null);
        
        /** @type {Student} */ 
        this.student = $state(null);

        /** @type {String} */
        this.studentId = studentId;

        /** @type {BaseTable<StudentAttendanceDaySummaryTableElement>} */
        this.table = $state(null);
    }

    onMount = async () => {
        this.userData = await validateUserAccess();
        this.student = await Student.getById(this.studentId);

        let records = await this.student.getAttendanceDaySummaries();
        console.log(records);

        this.table = new BaseTable(StudentAttendanceDaySummaryTableElement);
        this.table.getRowStyleClass = element => {
            if (element.summary.attendanceStatus == 'Attended') return styles['attended'];
            if (element.summary.attendanceStatus == 'AttendedLate') return styles['attended-late'];
            if (element.summary.attendanceStatus == 'AbscentWithExecuse') return styles['absence-with-excuse'];
            if (element.summary.attendanceStatus == 'AbscentWithoutExecuse') return styles['absence-without-excuse'];
            return null;
        }
        this.table.getColumnStyleClass = (header, element) => {
            if (header.displayName == StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_POINTS_DISPLAY_NAME) {
                return styles['total-points-column']
            }
        }

        this.table.elements = records.map(r => new StudentAttendanceDaySummaryTableElement(r));
    }
}
import { PageRecitationRecord } from "$lib/sdk/models/page-recitation-record.svelte";
import { BaseTable, BaseTableElement } from "../base-table/base-table.svelte";
import { SystemButton } from "../forms/system-button/system-button.svelte";
import { PageRecitationRewardCancellationRecord as CancellationRecord } from "$lib/sdk/models/page-recitation-reward-cancellation-record.svelte";
import { IndividualActivity } from "$lib/sdk/models/indivisual-activity.svelte";
import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";

import TableRenderer from "../base-table/table-renderer.svelte";
import SystemButtonRenderer from "$lib/components/forms/system-button/system-button-renderer.svelte";

/**
 * @typedef PageRecitationRewardRecord
 * @property {string} pageRecitationRecordId
 * @property {int} points
 */

/** 
 * @typedef StudentAttendanceDaySummary 
 * @property {AttendanceDay} attendanceDay
 * @property {StudentAttendanceRecord} attendanceRecord
 * @property {String} attendanceStatus
 * @property {PageRecitationRecord[]} recitationRecords
 * @property {CancellationRecord[]} cancellationRecords
 * @property {IndividualActivity[]} indivsualActivities
 * @property {String} indivsualActivityNotes
 * @property {String} groupActivityNotes
 * @property {int} attendancePoints
 * @property {PageRecitationRewardRecord[]} pageRecitationPointsRecords
*/

/** 
 * @param {string} status
 * @returns {string}
 */
function mapStatus(status) {
    if (status == 'AbscentWithoutExecuse') return 'غياب بدون عذر';
    if (status == 'AbscentWithExecuse') return 'غياب عذر';
    if (status == 'AttendedLate') return 'حاضر متأخر';
    if (status == 'Attended') return 'حاضر';
    return '-----'
}

/**
 * @template T 
 * @typedef {import "../base-table/base-table.svelte".TableElementHeader<T>} TableElementHeader<T> */

export class StudentAttendanceDaySummaryTableElement extends BaseTableElement {

    static STUDENT_TOTAL_POINTS_COLUMN_DISPLAY_NAME = "النقاط الكلية" 
    static STUDENT_TOTAL_ATTENDANCE_POINT_COLUMN_DISPLAY_NAME = "نقاط الحضور" 
    static STUDENT_TOTAL_MEMORIZATION_POINT_COLUMN_DISPLAY_NAME = "نقاط التسميع" 
    static STUDENT_TOTAL_ACTIVITIES_POINT_COLUMN_DISPLAY_NAME = "نقاط النشاط"

    /** * @param {StudentAttendanceDaySummary} summary */
    constructor(summary) {
        super();
        
        /** @type {StudentAttendanceDaySummary} */
        this.summary = $state(summary);
    }

    /**
     * @returns {TableElementHeader<StudentAttendanceDaySummaryTableElement>[]}
     */
    static getHeaders() {
        return [
            {
                displayName: "اليوم",
                render: (element) => {
                    const date = new Date(element.summary.attendanceDay.date);
                    if (!date || isNaN(date)) return "";

                    // Arabic weekday, English digits
                    const weekday = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', numberingSystem: 'latn' }).format(date);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();

                    return `${weekday} ${day}-${month}-${year}`; // e.g. السبت 21-03-2025
                }
            },
            {
                displayName: "الحالة",
                render: (element) => mapStatus(element.summary.attendanceStatus)
            },
            {
                displayName: "الصفحات",
                render: (element) => {
                    const records = element.summary.recitationRecords;
                    const cancellationRecords = element.summary.cancellationRecords;
                    const recitationRewardRecords = element.summary.pageRecitationPointsRecords;

                    if (
                        element.summary.attendanceStatus !== 'Attended' &&
                        element.summary.attendanceStatus !== 'AttendedLate'
                    ) {
                        return '-----';
                    }

                    if (!records || records.length === 0) {
                        return `<span style="opacity:0.5">لا تسميع جديد</span>`;
                    }

                    return `
                        <style>
                            .page-boxes {
                                display: grid;
                                grid-template-columns: repeat(7, auto);
                                gap: 10px;
                                justify-content: center;
                            }

                            .page-box {
                                min-width: 32px;
                                padding: 4px 8px;
                                border-radius: 10px;
                                color: #000;
                                background: white;
                                box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
                                font-size: 13px;
                                font-weight: 600;
                                text-align: center;
                                line-height: 1.2;
                                user-select: none;
                            }

                            .cancelled-page-box {
                                background: #ff8b8b;
                            }
                        </style>

                        <div class="page-boxes">
                            ${records
                            .map(r => {
                                let rewardRecord = recitationRewardRecords.find(rewardRecord => rewardRecord.pageRecitationRecordId == r.id);

                                return `
                                    <span class="page-box ${cancellationRecords.find(c => c.pageRecitationRecordId == r.id) != null ? 'cancelled-page-box' : ''}">
                                        <p>${r.page.number}</p>

                                        <p style='font-size: 7px;'>${rewardRecord?.points || 0}</p>
                                    </span>
                                `
                            })
                            .join('')}
                        </div>
                    `;
                }
            },
            {
                displayName: StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_ATTENDANCE_POINT_COLUMN_DISPLAY_NAME,
                render: (element) => {
                    return element.summary.attendancePoints
                }
            },
            {
                displayName: StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_MEMORIZATION_POINT_COLUMN_DISPLAY_NAME,
                render: (element) => {
                    return element.summary.pageRecitationPointsRecords
                        .map(record => record.points)
                        .reduce((x1, x2) => x1 + x2, 0);
                }
            },
            {
                displayName: StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_ACTIVITIES_POINT_COLUMN_DISPLAY_NAME,
                render: (element) => {
                    let points = element.summary.indivsualActivities
                        .map(r => r.weight)
                        .reduce((x1, x2) => x1 + x2, 0);

                    return points == 0 ? '-' : points;
                }
            },
            {
                displayName: StudentAttendanceDaySummaryTableElement.STUDENT_TOTAL_POINTS_COLUMN_DISPLAY_NAME,
                render: (element) => {
                    let attendancePoints = element.summary.attendancePoints;
                    let recitationPoints = element.summary.pageRecitationPointsRecords
                        .map(record => record.points)
                        .reduce((x1, x2) => x1 + x2, 0);
                    return attendancePoints + recitationPoints;
                }
            },    
            {
                displayName: 'الملاحظات',
                render: (element) => {
                    let notes = [element.summary.groupActivityNotes, element.summary.indivsualActivityNotes];
                    notes = notes.filter(n => n != undefined && n != null && n.length >= 2);
                    return notes.length > 0 ? notes.join(' - ') : '------';
                }
            },
        ];
    }
}

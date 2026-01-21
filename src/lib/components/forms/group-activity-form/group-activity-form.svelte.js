import { Halqa } from "$lib/sdk/models/halqa.svelte";
import { Student } from "$lib/sdk/models/student.svelte";
import { GroupActivity } from "$lib/sdk/models/group-activity.svelte";
import { AttendanceDay } from "$lib/sdk/models/attendance-day.svelte";
import { formatArabicDate } from "../../../../utilities/util";

export class GroupActivityForm {
    constructor() {

        /** @type {GroupActivity} */ this.groupActivity = $state(null);
        /** @type {Student[]} */ this.students = $state([]);
        /** @type {Boolean} */ this.isActive = $state(false);
        /** @type {String} */ this.errorMessage = $state('');
        /** @type {AttendanceDay[]} */ this.attendanceDays = $state([]);

        this.attendanceDaysOptions = $state([]);

        /** @type {Function} */ this.onSubmit = () => {}
        /** @type {Function} */ this.onCancel = () => {}
    }

    onMount = () => {
        this.errorMessage = '';
    }

    /** 
     * @param {GroupActivity} groupActivity 
     * @param {Student[]} students
     * @param {(isSubmitted : Boolean) => {  }} responseCallback
     * */
    open = async (groupActivity, students, responseCallback = (r) => {}) => {
        this.isActive = true;
        this.students = students;
        this.groupActivity = groupActivity;

        this.attendanceDays = await AttendanceDay.getAll();
        this.attendanceDaysOptions = this.attendanceDays.map(a => {
            return { value: a.id, text: formatArabicDate(a.date) }
        })

        this.onSubmit = () => responseCallback(true);
        this.onCancel = () => responseCallback(false);
    }

    getStudentName = (studentId) => {
        return this.students.find(s => s.id == studentId)?.fullName
    }

    handleClickSubmit = () => {
        if (this.groupActivity.name?.length < 3) {
            this.errorMessage = 'الرجاء إدخال اسم النشاط';
            return;
        }

        if (this.attendanceDays.find(a => a.id == this.groupActivity.attendanceDayId) == null) {
            this.errorMessage = 'الرجاء تحديد التاريخ.';
            return;
        }

        this.errorMessage = '';

        this.onSubmit();
        this.close();
    }

    handleClickCancel = () => {
        this.onCancel();
        this.close();
    }
    
    close = () => this.isActive = false;
}
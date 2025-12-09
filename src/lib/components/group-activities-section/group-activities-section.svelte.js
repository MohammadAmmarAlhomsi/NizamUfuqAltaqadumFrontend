import { GroupActivity } from "$lib/sdk/models/group-activity.svelte";
import { Student } from "$lib/sdk/models/student.svelte";
import { GroupActivityForm } from "../forms/group-activity-form/group-activity-form.svelte";
import { ConfirmationWindow } from "../confirmation-window/confirmation-window.svelte";

/** @typedef {import("$lib/sdk/models/group-activity.svelte").StudentActivityWeight} StudentActivityWeight*/

export class GroupActivitiesSection {

    /** @param {String} halqaId */
    constructor(halqaId) {
        /** @type {GroupActivityForm} */ this.groupActivityForm = $state(null);
        /** @type {String} */ this.halqaId = $state(halqaId);
        /** @type {Student[]} */ this.students = $state([]);
        /** @type {GroupActivity[]} */ this.groupActivities = $state([]);
        /** @type {ConfirmationWindow} */ this.confirmationWindow = $state(new ConfirmationWindow());
        
        this.groupActivityForm = new GroupActivityForm();
    }

    initiateNewGroupActivity = () => {
        return new GroupActivity(
            '', new Date(), this.halqaId,
            this.students.map(s => { return { studentId: s.id, weight: 0 } }),
            ''
        );
    }

    onMount = async () => {
        await this.loadStudents();
        await this.loadGroupActivities();
    }

    /** @param {GroupActivity} groupActivity */
    handleClickDelete = async (groupActivity) => {
        this.confirmationWindow.open(
            'هل أنت متأكد من حذف النشاط؟؟',
            async (isConfirmed) => {
                if (!isConfirmed) return;
                await groupActivity.delete();
                await this.loadGroupActivities();
            }
        )
    }

    handleClickGroupActivity = async (groupActivity) => {
        this.groupActivityForm.open(groupActivity, this.students, async (isSubmitted) => {
            if (isSubmitted) { 
                await groupActivity.save();
                await this.loadGroupActivities();
            }
        });
    }

    loadStudents = async () => {
        this.students = await Student.loadHalqaStudents(this.halqaId);
    }

    loadGroupActivities = async () => {
        this.groupActivities = await GroupActivity.getHalqaGroupActivities(this.halqaId);
    }

    handleClickAddNew= async () => {
        let groupActivity = this.initiateNewGroupActivity();
        this.groupActivityForm.open(groupActivity, this.students, async isSubmitted => {
            await groupActivity.save();
            await this.loadGroupActivities();
        });

    }
}
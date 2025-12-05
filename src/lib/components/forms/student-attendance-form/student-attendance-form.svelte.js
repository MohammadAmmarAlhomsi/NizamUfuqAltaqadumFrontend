import { Renderer } from "$lib/renderer";

import { QuranPage } from "$lib/sdk/models/quran-page.svelte";
import { PageRecitationRecord } from "$lib/sdk/models/page-recitation-record.svelte";
import { PageRecitationRewardCancellationRecord as CancellationRecord, PageRecitationRewardCancellationRecord } from "$lib/sdk/models/page-recitation-reward-cancellation-record.svelte";
import { Student } from "$lib/sdk/models/student.svelte";
import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";
import { PageRecitationBox } from "$lib/components/page-recitation-box/page-recitation-box.svelte";

/** @typedef {'recited-and-not-rewarded-page' | 'recitd-and-rewarded-page' | 'not-recited-page' } QuranPageCategoryName */
/** @typedef {{name: string, func: function}} Behaviour */
/** @typedef {{name: QuranPageCategoryName, behaviours: Array<Behaviour>}} Category */

export class StudentAttendanceForm extends Renderer {
    constructor() {
        super();

        /** @type {StudentAttendanceRecord} */ this.studentAttendanceRecord = $state(null);
        /** @type {Student} */ this.student = $state(null);
        /** @type {Array<QuranPage>} */ this.quranPages = $state([]);
        /** @type {Array<PageRecitationRecord>} */ this.pageRecitationRecords = $state([]);
        /** @type {Array<CancellationRecord>} */ this.cancellationRecords = $state([]);
        /** @type {Array<PageRecitationBox>} */ this.pagesBoxes = $state([]);
        /** @type {Array<Category>} */ this.categories = $state([]);
        /** @type {Category} */ this.currentSelectionCategory = $state(null);
        
        /** @type {Array<{value: object, text: string}>} */
        this.attendanceOptions = [
            { value: "Attended", text: "حاضر" },
            { value: "AttendedLate", text: "حاضر متأخر" },
            { value: "AbscentWithExecuse", text: "غياب بعذر" },
            { value: "AbscentWithoutExecuse", text: "غياب بدون عذر" },
        ];
        
        /** @type {Boolean} */ this.showPageBoxes = $derived(
            this.studentAttendanceRecord.status == 'Attended' ||
            this.studentAttendanceRecord.status == 'AttendedLate'
        );

        this.initializeCategories();
    }

    initializeCategories = () => {
        this.categories = [
            { name: 'not-recited-page', behaviours: this.notRecitedCategoryBehaviours() },
            { name: 'recitd-and-rewarded-page', behaviours: this.recitedCategoryBehaviours() },
            { name: 'recited-and-not-rewarded-page', behaviours: this.rewardCancelledCategoryBehaviours() }
        ];
    }

    /** * @param {StudentAttendanceRecord} studentAttendanceRecord */
    initialize(studentAttendanceRecord) {
        this.studentAttendanceRecord = studentAttendanceRecord;
    }

    load = async () => {
        if (this.studentAttendanceRecord == null) return;

        this.student = await Student.getById(this.studentAttendanceRecord.studentId);
        this.quranPages = await this.student.getAccessibleQuranPages();
        this.recitationRecords = await PageRecitationRecord.getStudentAvailablePageRecitationRecords(this.student.id);
        this.cancellationRecords = await CancellationRecord.getStudentAccessibleRecords(this.student.id);

        this.pagesBoxes = this.quranPages.map(quranPage => new PageRecitationBox(quranPage));
        this.pagesBoxes.forEach(pageBox => {
            let recitationRecord = this.getRecitationRecord(pageBox.quranPage);

            pageBox.onclick = () => this.handleClickRecitationBox(pageBox);
            pageBox.category = this.getQuranPageCategoryName(pageBox.quranPage);
            pageBox.isRecitedToday = recitationRecord != null && recitationRecord.studentAttendanceRecordId == this.studentAttendanceRecord.id;

            if (recitationRecord != null) {
                let recitationIdx = this.recitationRecords.indexOf(recitationRecord);
                pageBox.order = recitationIdx + 1;
            }
        });
    } 

    getSelectedPageBoxes() {
        return this.pagesBoxes.filter(pageBox => pageBox.isSelected);
    }

    /** @param {PageRecitationBox} pageRecitationBox */
    handleClickRecitationBox = (pageRecitationBox) => {
        let selectedPagesBoxes = this.getSelectedPageBoxes();
        let cachedCategory = '';
        if (selectedPagesBoxes.length > 0) {
            cachedCategory = this.getQuranPageCategoryName(selectedPagesBoxes[0].quranPage);
        }
        let currentCategory = this.getQuranPageCategoryName(pageRecitationBox.quranPage);
        if (cachedCategory != currentCategory) {
            this.deselectAll();
        }

        pageRecitationBox.isSelected = !pageRecitationBox.isSelected;

        this.updateCurrentCategory();
    }

    updateCurrentCategory() {
        let selectedPagesBoxes = this.getSelectedPageBoxes();
        if (selectedPagesBoxes.length == 0) { this.currentSelectionCategory = null; return; }
        let currentCategoryName = this.getQuranPageCategoryName(selectedPagesBoxes[0].quranPage);
        this.currentSelectionCategory = this.categories.find(cat => cat.name == currentCategoryName);
    }

    /** @returns {Array<Behaviour>} */
    notRecitedCategoryBehaviours = () => {
        return [
            { name: "تسجيل تسميع جديد", func: this.registerRecitationRecords },
        ]
    }

    /** @returns {Array<Behaviour>} */
    recitedCategoryBehaviours = () => {
        return [
            { name: 'إلغاء النقاط', func: this.registerCancellationRecords },
            { name: 'حذف سجل التسميع', func: this.deleteRecitationRecords },
        ]
    }

    /** @returns {Array<Behaviour>} */
    rewardCancelledCategoryBehaviours = () => {
        return [
            { name: 'إعادة النقاط', func: this.deleteCancellationRecords },
            { name: 'حذف سجل التسميع', func: this.deleteRecitationRecords }
        ]
    }

    deselectAll = () => {
        this.pagesBoxes.forEach(box => box.isSelected = false);
        
        this.updateCurrentCategory();
    }

    /** @param {QuranPage} quranPage */
    getRecitationRecord(quranPage) {
        return this.recitationRecords.find(record => record.pageId == quranPage.id);
    }

    /** @param {PageRecitationRecord} recitationRecord */
    getCancellationRecord(recitationRecord) {
        if (recitationRecord == null) return null;
        return this.cancellationRecords.find(record => record.pageRecitationRecordId == recitationRecord.id);
    }

    /** 
     * @param {QuranPage} quranPage 
     * @returns {QuranPageCategoryName} */
    getQuranPageCategoryName = (quranPage) => {
        let recitationRecord = this.getRecitationRecord(quranPage);
        let cancellationRecord = this.getCancellationRecord(recitationRecord);

        if (cancellationRecord != null) {
            return 'recited-and-not-rewarded-page';
        } else if (recitationRecord != null) {
            return 'recitd-and-rewarded-page'
        } else {
            return 'not-recited-page'
        }
    }

    getSelectedQuranPages = () => {
        return this.getSelectedPageBoxes().map(pb => pb.quranPage);
    }

    getSelectedRecitationRecords = () => {
        let selectedPagesBoxes = this.getSelectedPageBoxes();
        let recitationRecords = this.recitationRecords.filter(
            recitationRecord => selectedPagesBoxes.find(pb => pb.quranPage.id == recitationRecord.pageId) != null
        )
        return recitationRecords;
    }

    getSelectedCancellationRecords = () => {
        let selectedRecitationReceords = this.getSelectedRecitationRecords();
        return this.cancellationRecords.filter(
            cancellationRecord => selectedRecitationReceords.find(r => r.id == cancellationRecord.pageRecitationRecordId) != null
        )
    }

    registerRecitationRecords = async () => {
        let selectedQuranPages = this.getSelectedQuranPages();
        let recitationRecords = selectedQuranPages.map(quranPage => {
            return new PageRecitationRecord(quranPage.id, this.studentAttendanceRecord.id, null, new Date());
        })
 
        for (let i = 0; i < recitationRecords.length; i++)
            await recitationRecords[i].save(true);

        await this.load();
        this.deselectAll();
    } 

    deleteRecitationRecords = async () => {
        let selectedRecitationRecords = this.getSelectedRecitationRecords();

        for (let i = 0; i < selectedRecitationRecords.length; i++) 
            await selectedRecitationRecords[i].delete();

        await this.load();
        this.deselectAll();
    }

    registerCancellationRecords = async () => {
        let selectedRecitationRecords = this.getSelectedRecitationRecords();
        
        let cancellationRecords = selectedRecitationRecords.map(recitationRecord => {
            return new CancellationRecord(recitationRecord.id);
        });

        for (let i = 0; i < cancellationRecords.length; i++)
            await cancellationRecords[i].save();

        this.load();
        this.deselectAll();
    }

    deleteCancellationRecords = async () => {
        let selectedCancellatioNRecords = this.getSelectedCancellationRecords();

        for (let i = 0; i < selectedCancellatioNRecords.length; i++)
            await selectedCancellatioNRecords[i].delete();

        this.load();
        this.deselectAll();
    }

    submit = async () => {
        await this.studentAttendanceRecord.save();
        window.history.back();
    }
}
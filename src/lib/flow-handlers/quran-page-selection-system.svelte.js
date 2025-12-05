import { SelectionSystem } from "./selection-system.svelte";
import { QuranPage } from "$lib/sdk/models/quran-page.svelte";
import { PageRecitationRecord } from "$lib/sdk/models/page-recitation-record.svelte";
import { PageRecitationRewardCancellationRecord as CancellationRecord, PageRecitationRewardCancellationRecord } from "$lib/sdk/models/page-recitation-reward-cancellation-record.svelte";
import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";

/** @typedef {import('./selection-system.svelte').Category} Category */
/** @typedef {import("./selection-system.svelte").Behaviour} Behaviour */

/** @extends {SelectionSystem<QuranPage>} */
export class QuranPageSelectionSystem extends SelectionSystem {

    static NOT_RECITED_CATEGORY = 'notRecitedPage';
    static RECITED_ACTIVE_CATEGORY = 'recitedActivePage';
    static RECITED_CANCELLED_CATEGORY = 'recitedCancelledPage'
    
    /**
     * @param {Array<QuranPage>} quranPages 
     * @param {Array<PageRecitationRecord>} recitationRecords 
     * @param {Array<PageRecitationRewardCancellationRecord>} cancellationRecords 
     * @param {StudentAttendanceRecord} studentAttendanceRecord
     * @param {() => { }} refresh
     */
    constructor(quranPages, recitationRecords, cancellationRecords, studentAttendanceRecord, refresh) {
        super();

        /** @type {Array<QuranPage>} */ this.quranPages = quranPages;
        /** @type {Array<PageRecitationRecord>} */ this.recitationRecords = recitationRecords;
        /** @type {Array<CancellationRecord>} */ this.cancellationRecords = cancellationRecords;
        /** @type {StudentAttendanceRecord} */ this.studentAttendanceRecord = studentAttendanceRecord;
        /** @type {() => { }} */ this.refresh = refresh;
        /** @type {Array<Category>} */ this.categories = [];

        this.setItems(this.quranPages);

        this.initializeCategories();
    }

    /** @returns {Array<Behaviour>} */
    notRecitedCategoryBehaviours() {
        return [
            { name: "تسجيل تسميع جديد", func: this.registerRecitationRecords },
        ]
    }

    /** @returns {Array<Behaviour>} */
    recitedCategoryBehaviours() {
        return [
            { name: 'إلغاء النقاط', func: this.registerCancellationRecords },
            { name: 'حذف سجل التسميع', func: this.deleteRecitationRecords },
        ]
    }

    /** @returns {Array<Behaviour>} */
    rewardCancelledCategoryBehaviours() {
        return [
            { name: 'إعادة النقاط', func: this.deleteCancellationRecords },
            { name: 'حذف سجل التسميع', func: this.deleteRecitationRecords }
        ]
    }

    initializeCategories() {
        this.categories = [
            { name: QuranPageSelectionSystem.NOT_RECITED_CATEGORY, behaviours: this.notRecitedCategoryBehaviours() },
            { name: QuranPageSelectionSystem.RECITED_ACTIVE_CATEGORY, behaviours: this.recitedCategoryBehaviours() },
            { name: QuranPageSelectionSystem.RECITED_CANCELLED_CATEGORY, behaviours: this.rewardCancelledCategoryBehaviours() }
        ];
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

    /** @param {string} categoryName */
    getCategory(categoryName) {
        return this.categories.find(category => category.name == categoryName);
    }

    /** @param {QuranPage} quranPage */
    getItemCategoryName = (quranPage) => {
        let recitationRecord = this.getRecitationRecord(quranPage);
        let cancellationRecord = this.getCancellationRecord(recitationRecord);

        if (cancellationRecord != null) {
            return QuranPageSelectionSystem.RECITED_CANCELLED_CATEGORY;
        } else if (recitationRecord != null) {
            return QuranPageSelectionSystem.RECITED_ACTIVE_CATEGORY;
        } else {
            return QuranPageSelectionSystem.NOT_RECITED_CATEGORY;
        }
    }

    getSelectedRecitationRecords = () => {
        return this.recitationRecords.filter(record => {
            return this.quranPages.find(quranPage => quranPage.id == record.pageId) != null; 
        });
    }

    getSelectedCancellationRecords = () => {
        let recitationRecords = this.getSelectedRecitationRecords();
        return this.cancellationRecords.filter(record => {
            return recitationRecords.find(recitationRecord => recitationRecord.id == record.pageRecitationRecordId) != null;
        })
    }

    registerRecitationRecords = async () => {
        let selectedQuranPages = this.getSelectedItems();
        let recitationRecords = selectedQuranPages.map(quranPage => {
            return new PageRecitationRecord(quranPage.id, this.studentAttendanceRecord.id, null, new Date());
        });

        for (let i = 0; i < recitationRecords.length; i++)
            await recitationRecords[i].save();

        console.log(`${recitationRecords.length} has created.`);

        this.refresh();
    } 

    deleteRecitationRecords = async () => {
        let selectedRecitationRecords = this.getSelectedRecitationRecords();

        for (let i = 0; i < selectedRecitationRecords.length; i++) 
            await selectedRecitationRecords[i].delete();

        console.log(`${selectedRecitationRecords.length} has deleted.`);

        this.refresh();
    }

    registerCancellationRecords = async () => {
        let selectedRecitationRecords = this.getSelectedRecitationRecords();

        let cancellationRecords = selectedRecitationRecords.map(recitationRecord => {
            return new CancellationRecord(recitationRecord.id);
        });

        for (let i = 0; i < cancellationRecords.length; i++)
            await cancellationRecords[i].save();

        this.refresh();
    }

    deleteCancellationRecords = async () => {
        let selectedCancellatioNRecords = this.getSelectedCancellationRecords();

        for (let i = 0; i < selectedCancellatioNRecords.length; i++)
            await selectedCancellatioNRecords[i].delete();

        this.refresh();
    }
}
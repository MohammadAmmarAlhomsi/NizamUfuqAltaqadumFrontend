import { QuranPage } from "$lib/sdk/models/quran-page.svelte";

export class PageRecitationBox {

    /** @param {QuranPage} quranPage */
    constructor(quranPage, onclick= () => {}) {
        /** @type {QuranPage} */ this.quranPage = $state(quranPage);
        /** @type {Boolean} */ this.isSelected = $state(false);
        /** @type {String} */ this.category = $state('');
        /** @type {Boolean} */ this.isRecitedToday = $state(false);
        /** @type {Number|Null} */ this.order = $state(null);
        
        /** @type {Function} */ this.onclick = onclick;
    }

    handleClick = () => {
        this.onclick();
    }
}

/** @typdef  */

import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import TableSectionRenderer from './table-section-renderer.svelte'
import TableRenderer from '$lib/components/base-table/table-renderer.svelte'

/** @template TElement */
export class TableSection {

    /** 
     * @param {TElement} tableElementConstructor
    */
    constructor(tableElementConstructor) {
        this.tableElementConstructor = tableElementConstructor;

        /** @type {BaseTable<TElement>} */
        this.table = $state(new BaseTable(tableElementConstructor));

        this.Renderer = $state(TableRenderer);
    }

    loadElements = async () => {
        throw new Error("not imeplemented.");
    }

    createNew = async () => {
        throw new Error("not implemneted");
    }

    onMount = async () => {
        console.log('load eleemnts');
        await this.loadElements();
    }
}
import { TableSection } from "./table-section.svelte";
import { BaseTable } from "$lib/components/base-table/base-table.svelte";
import { HalqatTableElement } from "$lib/components/tables-elements/halqat-table-element.svelte";
import { Halqa } from "$lib/sdk/models/halqa.svelte";

/** @extends {TableSection<HalqatTableElement>} */
export class HalqatSection extends TableSection {

    constructor() {
        super(HalqatTableElement);

        this.table.isRowClickable = true;

        this.table.addEventListener('clickRow', e => {
            let halqa = e.detail.element.halqa;
            window.location.href = `/halqa/${halqa.id}`
        });
    }

    loadElements = async () => {
        let halqat = await Halqa.getAll();
        this.table.elements = halqat.map(h => new HalqatTableElement(h));
    }

    createNew = async () => {
        window.location.href = `/halqa/create`
    }
}
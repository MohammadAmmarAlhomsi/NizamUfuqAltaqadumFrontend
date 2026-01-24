/** 
 * @template TElement
 * @typedef {object} TableElementHeader
 * @property {string} displayName
 * @property {object} Renderer
 * @property {object} rendererSource
 * @property {(element: TElement) => any} [render]
 */

/**
 * @template TElement
 * @typedef {object} InstructionButton
 * @property {(element: TElement) => string} getLabel 
 * @property {(element: TElement) => any} onclick
 */

/**
 * @typedef {Object} BaseTableEventMap
 * @property {Event} clickRow
 */

export class BaseTableElement {
    /**
     * @template TThis
     * @returns {TableElementHeader<TThis>[]} 
     */
    static getHeaders() {
        throw new Error("not implemented");
    }

    /** 
     * @template TThis
     * @type {InstructionButton<TThis>} 
     * */
    static instructionButtons = [] 
}

/** @template {BaseTableElement} TElement */
export class BaseTable extends EventTarget {

    /** @param {new () => TElement} tableElementConstructor */
    constructor(tableElementConstructor) {
        super();

        /** @type {TElement[]} */
        this.elements = $state([]);

        /** @type {new () => TElement} */
        this.tableElementConstructor = tableElementConstructor;

        /** @type {(element: TElement) => {  }} */
        this.getRowStyleClass = (element) => { return null; };

        /** @type {(header: TableElementHeader<TElement>, element: TElement) => {  }} */
        this.getColumnStyleClass = (header, element) => { return null; };

        /** @type {boolean} */
        this.isRowClickable = $state(false);
    }

    /** @param {keyof BaseTableEventMap} type */
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }

    /** @param {keyof BaseTableEventMap} type */
    removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
    }

    /** 
     * @type {TElement} 
     * @type {int}
    */
    handleClickRow = (element, idx) => {
        if (this.isRowClickable) {
            this.dispatchEvent(new CustomEvent('clickRow', { detail: { element, idx }}));
        }
    }
}
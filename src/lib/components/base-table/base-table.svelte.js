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
export class BaseTable {

    /** @param {new () => TElement} tableElementConstructor */
    constructor(tableElementConstructor) {
        
        /** @type {BaseTableElement[]} */
        this.elements = $state([]);

        /** @type {new () => TElement} */
        this.tableElementConstructor = tableElementConstructor;

        /** @type {(element: TElement) => {  }} */
        this.getRowStyleClass = (element) => { return null; };

        /** @type {(header: TableElementHeader<TElement>, element: TElement) => {  }} */
        this.getColumnStyleClass = (header, element) => { return null; };
    }
}
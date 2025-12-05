/** @typedef {{name: string, func: function}} Behaviour */
/** @typedef {{name: string, behaviours: Array<Behaviour>}} Category */

/** @template TItem */
export class SelectableItem {
    /** @param {TItem} item */
    constructor(item) {
        /** @type {TItem} */ this.item = $state(item);
        /** @type {Boolean} */ this.isSelected = $state(false);
    }
}

/** @template TItem */
export class SelectionSystem {

    constructor() {

        /** @type {Array<SelectableItem<TItem>>} */ this.selectableItems = $state([]);
        /** @type {Array<Category>} */ this.categories = [];
        /** @type {Category} */ this.selectionCategory = $state(null);
    }

    /** 
     * @param {TItem} item
     * @returns {string} 
     * */
    getItemCategoryName(item) {
        throw new Error("Not Implemented");
    }

    /** @param {Array<TItem>} items */
    setItems(items) {
        this.selectableItems = items.map(item => new SelectableItem(item));

    }

    /** @param {TItem} item */
    handleClickItem(item) {
        let selectableItem = this.selectableItems.find(si => si.item === item);
        if (selectableItem == null) return;
        if (selectableItem.isSelected) {
            this.deselectItem(item);
        } else {
            this.selectItem(item);
        }
    }

    /** @returns {Array<TItem>} */
    getSelectedItems() {
        return this.selectableItems
            .filter(s => s.isSelected)
            .map(si => si.item);
    }

    /** @param {TItem} item */
    isItemMatchingSelectionCategory(item) {
        let existingItemCategory = -1;
        let itemCategory = this.getItemCategory(item);
        
        let selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0)
            existingItemCategory = this.getItemCategory(selectedItems[0]);

        return itemCategory == existingItemCategory;
    }

    /** @param {TItem} item */
    getItemCategory(item) {
        let categoryName = this.getItemCategoryName(item);
        return this.categories.find(category => category.name == categoryName);
    }

    /** @param {TItem} itemToSelect */
    selectItem(itemToSelect) {
        let selectableItem = this.selectableItems.find(si => si.item === itemToSelect);
        if (selectableItem == null) return;

        if (!this.isItemMatchingSelectionCategory(itemToSelect))
            this.deselectAll();

        this.selectionCategory = this.getItemCategory(itemToSelect);
        selectableItem.isSelected = true;
    }

    /** @param {TItem} itemToDeselect */
    deselectItem(itemToDeselect) {
        let selectableItem = this.selectableItems.find(si => si.item === itemToDeselect);
        if (selectableItem == null) return;
        selectableItem.isSelected = false;

        let selectedItems = this.getSelectedItems();
        if (selectedItems.length == 0) {
            this.selectionCategory = null;
        }
    }

    deselectAll() {
        for (let selectableItem of this.selectableItems) {
            selectableItem.isSelected = false;
        }
        this.selectionCategory = null;
    }
}
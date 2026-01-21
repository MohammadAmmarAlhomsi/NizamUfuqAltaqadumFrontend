
/**
 * @typedef {Object} SystemButtonEventMap
 * @property {Event} click
 * @property {Event} focus
 */

export class SystemButton extends EventTarget {
    constructor(text = '') {
        super();
        /** @type {string} */
        this.text = $state(text);
    }

    /** @param {keyof SystemButtonEventMap} type */
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }

    /** @param {keyof SystemButtonEventMap} type */
    removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
    }

    /** @param {keyof SystemButtonEventMap} type */
    invokeEvent(type, detail = null) {
        const event = detail !== null
            ? new CustomEvent(type, { detail })
            : new Event(type);
        this.dispatchEvent(event);
    }

    /** Convenience method for clicks */
    invokeClick(detail = null) {
        this.invokeEvent('click', detail);
    }
}
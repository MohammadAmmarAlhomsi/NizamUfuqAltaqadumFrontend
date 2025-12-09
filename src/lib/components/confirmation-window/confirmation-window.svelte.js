export class ConfirmationWindow {
    constructor() {
        /** @type {string} */ this.message = $state('هل أنت متأكد من هذا الإجراء؟');
        /** @type {Boolean} */ this.isActive = $state(false);

        /** @type {Function} */ this.onConfirm = () => {}
        /** @type {Function} */ this.onCancel = () => {}
    }

    /** * Opens the confirmation window.
     * @param {string} message - The message to display to the user.
     * @param {(isConfirmed : Boolean) => {}} responseCallback - Callback function to be executed with true (confirmed) or false (cancelled).
     * */
    open = (message, responseCallback = r => {}) => {
        this.isActive = true;
        this.message = message;

        this.onConfirm = () => responseCallback(true);
        this.onCancel = () => responseCallback(false);
    }

    handleClickConfirm = () => {
        this.onConfirm();
        this.close();
    }

    handleClickCancel = () => {
        this.onCancel();
        this.close();
    }
    
    close = () => this.isActive = false;
}
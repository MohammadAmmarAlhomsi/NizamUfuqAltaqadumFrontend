import { sendWhatsAppNotification, getNotificationStatus } from "$lib/sdk/whatsapp";

export class WhatsAppNotificationPopup {
    constructor() {
        /** @type {boolean} */ this.isActive = $state(false);
        /** @type {string} */ this.studentName = $state('');
        /** @type {string} */ this.studentId = $state('');
        /** @type {string} */ this.halqaName = $state('');
        /** @type {string} */ this.attendanceStatus = $state('');
        /** @type {string} */ this.date = $state('');
        /** @type {string} */ this.message = $state('');
        /** @type {string} */ this.fatherPhone = $state('');
        /** @type {string} */ this.motherPhone = $state('');
        /** @type {boolean} */ this.sendToFather = $state(false);
        /** @type {boolean} */ this.sendToMother = $state(false);

        // Send status tracking
        /** @type {'idle' | 'sending' | 'done'} */ this.sendState = $state('idle');
        /** @type {string | null} */ this.notificationId = $state(null);
        /** @type {Array<{phone: string, label: string, status: string, errorMessage?: string}>} */ 
        this.recipientStatuses = $state([]);
        /** @type {number | null} */ this._pollInterval = null;
    }

    /**
     * Opens the notification popup with pre-filled data
     * @param {object} params
     * @param {string} params.studentId
     * @param {string} params.studentName
     * @param {string} params.halqaName
     * @param {string} params.attendanceStatus - 'AbscentWithExecuse' or 'AbscentWithoutExecuse'
     * @param {string} params.date - formatted date string
     * @param {string} params.fatherPhone
     * @param {string} params.motherPhone
     */
    open = ({ studentId, studentName, halqaName, attendanceStatus, date, fatherPhone, motherPhone }) => {
        this.studentId = studentId;
        this.studentName = studentName;
        this.halqaName = halqaName;
        this.attendanceStatus = attendanceStatus;
        this.date = date;
        this.fatherPhone = fatherPhone || '';
        this.motherPhone = motherPhone || '';
        this.sendToFather = !!fatherPhone;
        this.sendToMother = !!motherPhone;
        this.sendState = 'idle';
        this.notificationId = null;
        this.recipientStatuses = [];

        const firstName = studentName.split(' ')[0] || studentName;

        this.message = `السلام عليكم ورحمة الله وبركاته\nالسيد ولي أمر الطالب: ${firstName} المحترم\nنعلمكم أن ولدكم لم يحضر حلقة القرآن اليوم ولم يقدم عذرا لغيابه\nونأمل مزيدا من الالتزام للمحافظة على مقعده في الحلقة والله ولي التوفيق`;

        this.isActive = true;
    }

    /**
     * Send the notification
     */
    send = async () => {
        /** @type {Array<{phone: string, label: string}>} */
        const recipients = [];

        if (this.sendToFather && this.fatherPhone) {
            recipients.push({ phone: this.fatherPhone, label: 'father' });
        }
        if (this.sendToMother && this.motherPhone) {
            recipients.push({ phone: this.motherPhone, label: 'mother' });
        }

        if (recipients.length === 0) return;

        this.sendState = 'sending';
        this.recipientStatuses = recipients.map(r => ({
            phone: r.phone,
            label: r.label,
            status: 'Pending'
        }));

        const result = await sendWhatsAppNotification({
            studentId: this.studentId,
            studentName: this.studentName,
            recipients,
            message: this.message
        });

        if (!result) {
            this.sendState = 'done';
            this.recipientStatuses = recipients.map(r => ({
                phone: r.phone,
                label: r.label,
                status: 'Failed',
                errorMessage: 'فشل في إرسال الطلب'
            }));
            return;
        }

        this.notificationId = result.notificationId;
        this._startPolling();
    }

    _startPolling = () => {
        if (this._pollInterval) clearInterval(this._pollInterval);
        
        this._pollInterval = setInterval(async () => {
            if (!this.notificationId) return;
            
            const status = await getNotificationStatus(this.notificationId);
            if (!status) return;
            
            this.recipientStatuses = status.recipients;
            
            if (status.isComplete) {
                this.sendState = 'done';
                this._stopPolling();
            }
        }, 2000);
    }

    _stopPolling = () => {
        if (this._pollInterval) {
            clearInterval(this._pollInterval);
            this._pollInterval = null;
        }
    }

    close = () => {
        this._stopPolling();
        this.isActive = false;
    }

    skip = () => {
        this.close();
    }
}

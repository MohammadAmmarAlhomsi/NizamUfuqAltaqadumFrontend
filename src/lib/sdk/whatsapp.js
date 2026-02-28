import { APIGet, APIPost } from "./api-request";
import { host } from "./host";

/**
 * Get WhatsApp session status
 * @returns {Promise<{status: string, connected: boolean, name?: string, phone?: string, pushName?: string}>}
 */
export async function getWhatsAppStatus() {
    let response = await APIGet(`${host}/api/whats-app/status`);
    if (!response.succeed) return { status: 'STOPPED', connected: false };
    return response.data;
}

/**
 * Get QR code for WhatsApp session
 * @returns {Promise<{qr: string, mimetype: string} | null>}
 */
export async function getWhatsAppQr() {
    let response = await APIGet(`${host}/api/whats-app/qr`);
    if (!response.succeed) return null;
    return response.data;
}

/**
 * Start WhatsApp session
 * @returns {Promise<boolean>}
 */
export async function startWhatsAppSession() {
    let response = await APIPost(`${host}/api/whats-app/start`);
    return response.succeed;
}

/**
 * Stop WhatsApp session
 * @returns {Promise<boolean>}
 */
export async function stopWhatsAppSession() {
    let response = await APIPost(`${host}/api/whats-app/stop`);
    return response.succeed;
}

/**
 * Send WhatsApp notification (queued, returns immediately with notificationId)
 * @param {object} params
 * @param {string} params.studentId
 * @param {string} params.studentName
 * @param {Array<{phone: string, label: string}>} params.recipients
 * @param {string} params.message
 * @returns {Promise<{notificationId: string} | null>}
 */
export async function sendWhatsAppNotification({ studentId, studentName, recipients, message }) {
    let response = await APIPost(`${host}/api/whats-app/send`, {
        studentId,
        studentName,
        recipients,
        message
    });
    if (!response.succeed) return null;
    return response.data;
}

/**
 * Get notification send status
 * @param {string} notificationId
 * @returns {Promise<{notificationId: string, recipients: Array<{phone: string, label: string, status: string, errorMessage?: string}>, isComplete: boolean} | null>}
 */
export async function getNotificationStatus(notificationId) {
    let response = await APIGet(`${host}/api/whats-app/send/${notificationId}/status`);
    if (!response.succeed) return null;
    return response.data;
}

import { loadAccessToken } from "./auth";

class APIResponse {
    /**
     * 
     * @param {boolean} succeed 
     * @param {object?} data 
     * @param {string} error 
     */
    constructor(succeed, data, error) {
        this.succeed = succeed;
        this.data = data;
        this.error = error
    }
}

/**
 * 
 * @param {string} url 
 * @returns {APIResponse}
 */
export async function APIGet(url) {
    return await APIFetch(url, 'GET', null);
}

/**
 * @template T
 * @param {string} url
 * @param {T} instanceClass
 * @returns {Array<T>}
 */
export async function APIGetArrayModel(url, instanceClass) {
    let response = await APIGet(url);
    let result = [];
    if (response.succeed) {
        result = response.data.map(item => {
            let instance = new instanceClass();
            Object.assign(instance, item);
            return instance;
        });
    }
    return result;
}

/** 
 * @template TElement
 * @param {string} url
 * @returns {TElement[]}
 */
export async function APIGetArrayObject(url) {
    let response = await APIGet(url);
    if (!response.succeed) return [];
    return response.data;
}

/**
 * 
 * @param {string} url 
 * @returns {APIResponse}
 */
export async function APIDelete(url) {
    return await APIFetch(url, 'DELETE', null);
}


/**
 * 
 * @param {string} url 
 * @param {object} body
 * @returns {APIResponse}
 */
export async function APIPost(url, body = {}) {
    return await APIFetch(url, 'POST', body);
}

/**
 * 
 * @param {string} url 
 * @param {object} body
 * @returns {APIResponse}
 */
export async function APIPut(url, body = {}) {
    return await APIFetch(url, 'PUT', body);
}

/**
 * 
 * @param {string} url 
 * @param {string} method
 * @param {object} body
 * @returns {APIResponse}
 */
export async function APIFetch(url, method='GET', body = {}) {
    try {
        const { token } = loadAccessToken();

        const fetchOptions = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        if (method !== 'GET' && method !== 'DELETE') {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        const result = await handleResponse(response);

        return new APIResponse(true, result, null);
    } catch (e) {
        console.error(e.message);
        return new APIResponse(false, null, e.error || e);
    }
}

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch");
    }

    return await response.json().catch(() => { });
}
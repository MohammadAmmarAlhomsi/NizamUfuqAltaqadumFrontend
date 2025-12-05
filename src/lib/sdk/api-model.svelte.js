import { APIDelete, APIGet, APIPut } from "./api-request";

export class APIModel {
    static getAllEndPoint() { throw new Error('Get All Not Implemented.'); }
    static getEndPoint(id) { throw new Error('Get Not implemented.'); }
    static upsertEndPoint(id) { throw new Error("Upsert Not implemented."); }
    static deleteEndPoint(id) { throw new Error('Delete Not implemented.'); }

    constructor() {
        this.id = $state(crypto.randomUUID());
    }

    /**
     * @template T
     * @this {new (...args: any[]) => T}
     * @returns {Promise<Array<T>>}
     */
    static async getAll() {
        let response = await APIGet(this.getAllEndPoint());
        if (!response.succeed) return [];

        return response.data.map(item => {
            let instance = new this();
            Object.assign(instance, item);
            return instance;
        })
    }

    /**
     * @template T
     * @this {new (...args: any[]) => T}
     * @param {string} id
     * @returns {Promise<T>}
     */
    static async getById(id) {
        let response = await APIGet(this.getEndPoint(id));
        if (!response.succeed) return null;
        
        let instance = new this();
        Object.assign(instance, response.data);
        return instance;
    }

    /**
     * @template T
     * @this {new (...args: any[]) => T}
     * @returns {Promise<T>}
     */
    static async get(url) {
        let response = await APIGet(url);
        if (!response.succeed) return null;
        if (response.data == null) return null;

        let instance = new this();
        Object.assign(instance, response.data);
        return instance;
    }

    save = async (alertError=false) => {
        let response = await APIPut(this.constructor.upsertEndPoint(this.id), this.toObject());
        if (alertError && !response.succeed)
            alert(response.error);
        return response;
    }

    load = async () => {
        let response = await APIGet(this.constructor.getEndPoint(this.id));
        Object.assign(this, response.data);
        return response;
    }

    delete = async() => {
        return await APIDelete(this.constructor.deleteEndPoint(this.id));
    }

    toObject() {
        const proto = Object.getPrototypeOf(this);
        const descriptors = Object.getOwnPropertyDescriptors(proto);
        let { constructor, ...variables } = descriptors
        let object = {};
        object.id = this.id;
        for (let key in variables) {
            object[key] = this[key];
        }
        return object;
    }
}
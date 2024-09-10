"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncAuthStore = void 0;
const BaseAuthStore_1 = require("@/stores/BaseAuthStore");
/**
 * AsyncAuthStore is a helper auth store implementation
 * that could be used with any external async persistent layer
 * (key-value db, local file, etc.).
 *
 * Here is an example with the React Native AsyncStorage package:
 *
 * ```
 * import AsyncStorage from "@react-native-async-storage/async-storage";
 * import PocketBase, { AsyncAuthStore } from "pocketbase";
 *
 * const store = new AsyncAuthStore({
 *     save:    async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
 *     initial: AsyncStorage.getItem("pb_auth"),
 * });
 *
 * const pb = new PocketBase("https://example.com", store)
 * ```
 */
class AsyncAuthStore extends BaseAuthStore_1.BaseAuthStore {
    constructor(config) {
        super();
        this.queue = [];
        this.saveFunc = config.save;
        this.clearFunc = config.clear;
        this._enqueue(() => this._loadInitial(config.initial));
    }
    /**
     * @inheritdoc
     */
    save(token, model) {
        super.save(token, model);
        let value = "";
        try {
            value = JSON.stringify({ token, model });
        }
        catch (err) {
            console.warn("AsyncAuthStore: failed to stringify the new state");
        }
        this._enqueue(() => this.saveFunc(value));
    }
    /**
     * @inheritdoc
     */
    clear() {
        super.clear();
        if (this.clearFunc) {
            this._enqueue(() => this.clearFunc());
        }
        else {
            this._enqueue(() => this.saveFunc(""));
        }
    }
    /**
     * Initializes the auth store state.
     */
    async _loadInitial(payload) {
        try {
            payload = await payload;
            if (payload) {
                let parsed;
                if (typeof payload === "string") {
                    parsed = JSON.parse(payload) || {};
                }
                else if (typeof payload === "object") {
                    parsed = payload;
                }
                this.save(parsed.token || "", parsed.model || null);
            }
        }
        catch (_) { }
    }
    /**
     * Appends an async function to the queue.
     */
    _enqueue(asyncCallback) {
        this.queue.push(asyncCallback);
        if (this.queue.length == 1) {
            this._dequeue();
        }
    }
    /**
     * Starts the queue processing.
     */
    _dequeue() {
        if (!this.queue.length) {
            return;
        }
        this.queue[0]().finally(() => {
            this.queue.shift();
            if (!this.queue.length) {
                return;
            }
            this._dequeue();
        });
    }
}
exports.AsyncAuthStore = AsyncAuthStore;
//# sourceMappingURL=AsyncAuthStore.js.map
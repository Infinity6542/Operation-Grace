"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAuthStore = void 0;
const BaseAuthStore_1 = require("@/stores/BaseAuthStore");
/**
 * The default token store for browsers with auto fallback
 * to runtime/memory if local storage is undefined (eg. in node env).
 */
class LocalAuthStore extends BaseAuthStore_1.BaseAuthStore {
    constructor(storageKey = "pocketbase_auth") {
        super();
        this.storageFallback = {};
        this.storageKey = storageKey;
        this._bindStorageEvent();
    }
    /**
     * @inheritdoc
     */
    get token() {
        const data = this._storageGet(this.storageKey) || {};
        return data.token || "";
    }
    /**
     * @inheritdoc
     */
    get model() {
        const data = this._storageGet(this.storageKey) || {};
        return data.model || null;
    }
    /**
     * @inheritdoc
     */
    save(token, model) {
        this._storageSet(this.storageKey, {
            token: token,
            model: model,
        });
        super.save(token, model);
    }
    /**
     * @inheritdoc
     */
    clear() {
        this._storageRemove(this.storageKey);
        super.clear();
    }
    // ---------------------------------------------------------------
    // Internal helpers:
    // ---------------------------------------------------------------
    /**
     * Retrieves `key` from the browser's local storage
     * (or runtime/memory if local storage is undefined).
     */
    _storageGet(key) {
        if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.localStorage)) {
            const rawValue = window.localStorage.getItem(key) || "";
            try {
                return JSON.parse(rawValue);
            }
            catch (e) {
                // not a json
                return rawValue;
            }
        }
        // fallback
        return this.storageFallback[key];
    }
    /**
     * Stores a new data in the browser's local storage
     * (or runtime/memory if local storage is undefined).
     */
    _storageSet(key, value) {
        if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.localStorage)) {
            // store in local storage
            let normalizedVal = value;
            if (typeof value !== "string") {
                normalizedVal = JSON.stringify(value);
            }
            window.localStorage.setItem(key, normalizedVal);
        }
        else {
            // store in fallback
            this.storageFallback[key] = value;
        }
    }
    /**
     * Removes `key` from the browser's local storage and the runtime/memory.
     */
    _storageRemove(key) {
        var _a;
        // delete from local storage
        if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.localStorage)) {
            (_a = window.localStorage) === null || _a === void 0 ? void 0 : _a.removeItem(key);
        }
        // delete from fallback
        delete this.storageFallback[key];
    }
    /**
     * Updates the current store state on localStorage change.
     */
    _bindStorageEvent() {
        if (typeof window === "undefined" ||
            !(window === null || window === void 0 ? void 0 : window.localStorage) ||
            !window.addEventListener) {
            return;
        }
        window.addEventListener("storage", (e) => {
            if (e.key != this.storageKey) {
                return;
            }
            const data = this._storageGet(this.storageKey) || {};
            super.save(data.token || "", data.model || null);
        });
    }
}
exports.LocalAuthStore = LocalAuthStore;
//# sourceMappingURL=LocalAuthStore.js.map
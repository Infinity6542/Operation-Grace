"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAuthStore = void 0;
const cookie_1 = require("@/stores/utils/cookie");
const jwt_1 = require("@/stores/utils/jwt");
const defaultCookieKey = "pb_auth";
/**
 * Base AuthStore class that is intended to be extended by all other
 * PocketBase AuthStore implementations.
 */
class BaseAuthStore {
    constructor() {
        this.baseToken = "";
        this.baseModel = null;
        this._onChangeCallbacks = [];
    }
    /**
     * Retrieves the stored token (if any).
     */
    get token() {
        return this.baseToken;
    }
    /**
     * Retrieves the stored model data (if any).
     */
    get model() {
        return this.baseModel;
    }
    /**
     * Loosely checks if the store has valid token (aka. existing and unexpired exp claim).
     */
    get isValid() {
        return !(0, jwt_1.isTokenExpired)(this.token);
    }
    /**
     * Checks whether the current store state is for admin authentication.
     */
    get isAdmin() {
        return (0, jwt_1.getTokenPayload)(this.token).type === "admin";
    }
    /**
     * Checks whether the current store state is for auth record authentication.
     */
    get isAuthRecord() {
        return (0, jwt_1.getTokenPayload)(this.token).type === "authRecord";
    }
    /**
     * Saves the provided new token and model data in the auth store.
     */
    save(token, model) {
        this.baseToken = token || "";
        this.baseModel = model || null;
        this.triggerChange();
    }
    /**
     * Removes the stored token and model data form the auth store.
     */
    clear() {
        this.baseToken = "";
        this.baseModel = null;
        this.triggerChange();
    }
    /**
     * Parses the provided cookie string and updates the store state
     * with the cookie's token and model data.
     *
     * NB! This function doesn't validate the token or its data.
     * Usually this isn't a concern if you are interacting only with the
     * PocketBase API because it has the proper server-side security checks in place,
     * but if you are using the store `isValid` state for permission controls
     * in a node server (eg. SSR), then it is recommended to call `authRefresh()`
     * after loading the cookie to ensure an up-to-date token and model state.
     * For example:
     *
     * ```js
     * pb.authStore.loadFromCookie("cookie string...");
     *
     * try {
     *     // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
     *     pb.authStore.isValid && await pb.collection('users').authRefresh();
     * } catch (_) {
     *     // clear the auth store on failed refresh
     *     pb.authStore.clear();
     * }
     * ```
     */
    loadFromCookie(cookie, key = defaultCookieKey) {
        const rawData = (0, cookie_1.cookieParse)(cookie || "")[key] || "";
        let data = {};
        try {
            data = JSON.parse(rawData);
            // normalize
            if (typeof data === null || typeof data !== "object" || Array.isArray(data)) {
                data = {};
            }
        }
        catch (_) { }
        this.save(data.token || "", data.model || null);
    }
    /**
     * Exports the current store state as cookie string.
     *
     * By default the following optional attributes are added:
     * - Secure
     * - HttpOnly
     * - SameSite=Strict
     * - Path=/
     * - Expires={the token expiration date}
     *
     * NB! If the generated cookie exceeds 4096 bytes, this method will
     * strip the model data to the bare minimum to try to fit within the
     * recommended size in https://www.rfc-editor.org/rfc/rfc6265#section-6.1.
     */
    exportToCookie(options, key = defaultCookieKey) {
        var _a, _b;
        const defaultOptions = {
            secure: true,
            sameSite: true,
            httpOnly: true,
            path: "/",
        };
        // extract the token expiration date
        const payload = (0, jwt_1.getTokenPayload)(this.token);
        if (payload === null || payload === void 0 ? void 0 : payload.exp) {
            defaultOptions.expires = new Date(payload.exp * 1000);
        }
        else {
            defaultOptions.expires = new Date("1970-01-01");
        }
        // merge with the user defined options
        options = Object.assign({}, defaultOptions, options);
        const rawData = {
            token: this.token,
            model: this.model ? JSON.parse(JSON.stringify(this.model)) : null,
        };
        let result = (0, cookie_1.cookieSerialize)(key, JSON.stringify(rawData), options);
        const resultLength = typeof Blob !== "undefined" ? new Blob([result]).size : result.length;
        // strip down the model data to the bare minimum
        if (rawData.model && resultLength > 4096) {
            rawData.model = { id: (_a = rawData === null || rawData === void 0 ? void 0 : rawData.model) === null || _a === void 0 ? void 0 : _a.id, email: (_b = rawData === null || rawData === void 0 ? void 0 : rawData.model) === null || _b === void 0 ? void 0 : _b.email };
            const extraProps = ["collectionId", "username", "verified"];
            for (const prop in this.model) {
                if (extraProps.includes(prop)) {
                    rawData.model[prop] = this.model[prop];
                }
            }
            result = (0, cookie_1.cookieSerialize)(key, JSON.stringify(rawData), options);
        }
        return result;
    }
    /**
     * Register a callback function that will be called on store change.
     *
     * You can set the `fireImmediately` argument to true in order to invoke
     * the provided callback right after registration.
     *
     * Returns a removal function that you could call to "unsubscribe" from the changes.
     */
    onChange(callback, fireImmediately = false) {
        this._onChangeCallbacks.push(callback);
        if (fireImmediately) {
            callback(this.token, this.model);
        }
        return () => {
            for (let i = this._onChangeCallbacks.length - 1; i >= 0; i--) {
                if (this._onChangeCallbacks[i] == callback) {
                    delete this._onChangeCallbacks[i]; // removes the function reference
                    this._onChangeCallbacks.splice(i, 1); // reindex the array
                    return;
                }
            }
        };
    }
    triggerChange() {
        for (const callback of this._onChangeCallbacks) {
            callback && callback(this.token, this.model);
        }
    }
}
exports.BaseAuthStore = BaseAuthStore;
//# sourceMappingURL=BaseAuthStore.js.map
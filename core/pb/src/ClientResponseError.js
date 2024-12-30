"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientResponseError = void 0;
/**
 * ClientResponseError is a custom Error class that is intended to wrap
 * and normalize any error thrown by `Client.send()`.
 */
class ClientResponseError extends Error {
    constructor(errData) {
        var _a, _b, _c, _d;
        super("ClientResponseError");
        this.url = "";
        this.status = 0;
        this.response = {};
        this.isAbort = false;
        this.originalError = null;
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ClientResponseError.prototype);
        if (errData !== null && typeof errData === "object") {
            this.url = typeof errData.url === "string" ? errData.url : "";
            this.status = typeof errData.status === "number" ? errData.status : 0;
            this.isAbort = !!errData.isAbort;
            this.originalError = errData.originalError;
            if (errData.response !== null && typeof errData.response === "object") {
                this.response = errData.response;
            }
            else if (errData.data !== null && typeof errData.data === "object") {
                this.response = errData.data;
            }
            else {
                this.response = {};
            }
        }
        if (!this.originalError && !(errData instanceof ClientResponseError)) {
            this.originalError = errData;
        }
        if (typeof DOMException !== "undefined" && errData instanceof DOMException) {
            this.isAbort = true;
        }
        this.name = "ClientResponseError " + this.status;
        this.message = (_a = this.response) === null || _a === void 0 ? void 0 : _a.message;
        if (!this.message) {
            if (this.isAbort) {
                this.message =
                    "The request was autocancelled. You can find more info in https://github.com/pocketbase/js-sdk#auto-cancellation.";
            }
            else if ((_d = (_c = (_b = this.originalError) === null || _b === void 0 ? void 0 : _b.cause) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.includes("ECONNREFUSED ::1")) {
                this.message =
                    "Failed to connect to the PocketBase server. Try changing the SDK URL from localhost to 127.0.0.1 (https://github.com/pocketbase/js-sdk/issues/21).";
            }
            else {
                this.message = "Something went wrong while processing your request.";
            }
        }
    }
    /**
     * Alias for `this.response` to preserve the backward compatibility.
     */
    get data() {
        return this.response;
    }
    /**
     * Make a POJO's copy of the current error class instance.
     * @see https://github.com/vuex-orm/vuex-orm/issues/255
     */
    toJSON() {
        return Object.assign({}, this);
    }
}
exports.ClientResponseError = ClientResponseError;
//# sourceMappingURL=ClientResponseError.js.map
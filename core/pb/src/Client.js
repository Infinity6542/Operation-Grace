"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientResponseError_1 = require("@/ClientResponseError");
const LocalAuthStore_1 = require("@/stores/LocalAuthStore");
const SettingsService_1 = require("@/services/SettingsService");
const AdminService_1 = require("@/services/AdminService");
const RecordService_1 = require("@/services/RecordService");
const CollectionService_1 = require("@/services/CollectionService");
const LogService_1 = require("@/services/LogService");
const RealtimeService_1 = require("@/services/RealtimeService");
const HealthService_1 = require("@/services/HealthService");
const FileService_1 = require("@/services/FileService");
const BackupService_1 = require("@/services/BackupService");
const options_1 = require("@/services/utils/options");
/**
 * PocketBase JS Client.
 */
class Client {
    constructor(baseUrl = "/", authStore, lang = "en-US") {
        this.cancelControllers = {};
        this.recordServices = {};
        this.enableAutoCancellation = true;
        this.baseUrl = baseUrl;
        this.lang = lang;
        this.authStore = authStore || new LocalAuthStore_1.LocalAuthStore();
        // services
        this.admins = new AdminService_1.AdminService(this);
        this.collections = new CollectionService_1.CollectionService(this);
        this.files = new FileService_1.FileService(this);
        this.logs = new LogService_1.LogService(this);
        this.settings = new SettingsService_1.SettingsService(this);
        this.realtime = new RealtimeService_1.RealtimeService(this);
        this.health = new HealthService_1.HealthService(this);
        this.backups = new BackupService_1.BackupService(this);
    }
    /**
     * Returns the RecordService associated to the specified collection.
     *
     * @param  {string} idOrName
     * @return {RecordService}
     */
    collection(idOrName) {
        if (!this.recordServices[idOrName]) {
            this.recordServices[idOrName] = new RecordService_1.RecordService(this, idOrName);
        }
        return this.recordServices[idOrName];
    }
    /**
     * Globally enable or disable auto cancellation for pending duplicated requests.
     */
    autoCancellation(enable) {
        this.enableAutoCancellation = !!enable;
        return this;
    }
    /**
     * Cancels single request by its cancellation key.
     */
    cancelRequest(requestKey) {
        if (this.cancelControllers[requestKey]) {
            this.cancelControllers[requestKey].abort();
            delete this.cancelControllers[requestKey];
        }
        return this;
    }
    /**
     * Cancels all pending requests.
     */
    cancelAllRequests() {
        for (let k in this.cancelControllers) {
            this.cancelControllers[k].abort();
        }
        this.cancelControllers = {};
        return this;
    }
    /**
     * Constructs a filter expression with placeholders populated from a parameters object.
     *
     * Placeholder parameters are defined with the `{:paramName}` notation.
     *
     * The following parameter values are supported:
     *
     * - `string` (_single quotes are autoescaped_)
     * - `number`
     * - `boolean`
     * - `Date` object (_stringified into the PocketBase datetime format_)
     * - `null`
     * - everything else is converted to a string using `JSON.stringify()`
     *
     * Example:
     *
     * ```js
     * pb.collection("example").getFirstListItem(pb.filter(
     *    'title ~ {:title} && created >= {:created}',
     *    { title: "example", created: new Date()}
     * ))
     * ```
     */
    filter(raw, params) {
        if (!params) {
            return raw;
        }
        for (let key in params) {
            let val = params[key];
            switch (typeof val) {
                case "boolean":
                case "number":
                    val = "" + val;
                    break;
                case "string":
                    val = "'" + val.replace(/'/g, "\\'") + "'";
                    break;
                default:
                    if (val === null) {
                        val = "null";
                    }
                    else if (val instanceof Date) {
                        val = "'" + val.toISOString().replace("T", " ") + "'";
                    }
                    else {
                        val = "'" + JSON.stringify(val).replace(/'/g, "\\'") + "'";
                    }
            }
            raw = raw.replaceAll("{:" + key + "}", val);
        }
        return raw;
    }
    /**
     * Legacy alias of `pb.files.getUrl()`.
     */
    getFileUrl(record, filename, queryParams = {}) {
        return this.files.getUrl(record, filename, queryParams);
    }
    /**
     * Builds a full client url by safely concatenating the provided path.
     */
    buildUrl(path) {
        var _a;
        let url = this.baseUrl;
        // construct an absolute base url if in a browser environment
        if (typeof window !== "undefined" &&
            !!window.location &&
            !url.startsWith("https://") &&
            !url.startsWith("http://")) {
            url = ((_a = window.location.origin) === null || _a === void 0 ? void 0 : _a.endsWith("/"))
                ? window.location.origin.substring(0, window.location.origin.length - 1)
                : window.location.origin || "";
            if (!this.baseUrl.startsWith("/")) {
                url += window.location.pathname || "/";
                url += url.endsWith("/") ? "" : "/";
            }
            url += this.baseUrl;
        }
        // concatenate the path
        if (path) {
            url += url.endsWith("/") ? "" : "/"; // append trailing slash if missing
            url += path.startsWith("/") ? path.substring(1) : path;
        }
        return url;
    }
    /**
     * Sends an api http request.
     *
     * @throws {ClientResponseError}
     */
    async send(path, options) {
        options = this.initSendOptions(path, options);
        // build url + path
        let url = this.buildUrl(path);
        if (this.beforeSend) {
            const result = Object.assign({}, await this.beforeSend(url, options));
            if (typeof result.url !== "undefined" ||
                typeof result.options !== "undefined") {
                url = result.url || url;
                options = result.options || options;
            }
            else if (Object.keys(result).length) {
                // legacy behavior
                options = result;
                (console === null || console === void 0 ? void 0 : console.warn) &&
                    console.warn("Deprecated format of beforeSend return: please use `return { url, options }`, instead of `return options`.");
            }
        }
        // serialize the query parameters
        if (typeof options.query !== "undefined") {
            const query = this.serializeQueryParams(options.query);
            if (query) {
                url += (url.includes("?") ? "&" : "?") + query;
            }
            delete options.query;
        }
        // ensures that the json body is serialized
        if (this.getHeader(options.headers, "Content-Type") == "application/json" &&
            options.body &&
            typeof options.body !== "string") {
            options.body = JSON.stringify(options.body);
        }
        const fetchFunc = options.fetch || fetch;
        // send the request
        return fetchFunc(url, options)
            .then(async (response) => {
            let data = {};
            try {
                data = await response.json();
            }
            catch (_) {
                // all api responses are expected to return json
                // with the exception of the realtime event and 204
            }
            if (this.afterSend) {
                data = await this.afterSend(response, data);
            }
            if (response.status >= 400) {
                throw new ClientResponseError_1.ClientResponseError({
                    url: response.url,
                    status: response.status,
                    data: data,
                });
            }
            return data;
        })
            .catch((err) => {
            // wrap to normalize all errors
            throw new ClientResponseError_1.ClientResponseError(err);
        });
    }
    /**
     * Shallow copy the provided object and takes care to initialize
     * any options required to preserve the backward compatability.
     *
     * @param  {SendOptions} options
     * @return {SendOptions}
     */
    initSendOptions(path, options) {
        options = Object.assign({ method: "GET" }, options);
        // auto convert the body to FormData, if needed
        options.body = this.convertToFormDataIfNeeded(options.body);
        // move unknown send options as query parameters
        (0, options_1.normalizeUnknownQueryParams)(options);
        // requestKey normalizations for backward-compatibility
        // ---
        options.query = Object.assign({}, options.params, options.query);
        if (typeof options.requestKey === "undefined") {
            if (options.$autoCancel === false || options.query.$autoCancel === false) {
                options.requestKey = null;
            }
            else if (options.$cancelKey || options.query.$cancelKey) {
                options.requestKey = options.$cancelKey || options.query.$cancelKey;
            }
        }
        // remove the deprecated special cancellation params from the other query params
        delete options.$autoCancel;
        delete options.query.$autoCancel;
        delete options.$cancelKey;
        delete options.query.$cancelKey;
        // ---
        // add the json header, if not explicitly set
        // (for FormData body the Content-Type header should be skipped since the boundary is autogenerated)
        if (this.getHeader(options.headers, "Content-Type") === null &&
            !this.isFormData(options.body)) {
            options.headers = Object.assign({}, options.headers, {
                "Content-Type": "application/json",
            });
        }
        // add Accept-Language header, if not explicitly set
        if (this.getHeader(options.headers, "Accept-Language") === null) {
            options.headers = Object.assign({}, options.headers, {
                "Accept-Language": this.lang,
            });
        }
        // check if Authorization header can be added
        if (
        // has valid token
        this.authStore.token &&
            // auth header is not explicitly set
            this.getHeader(options.headers, "Authorization") === null) {
            options.headers = Object.assign({}, options.headers, {
                Authorization: this.authStore.token,
            });
        }
        // handle auto cancelation for duplicated pending request
        if (this.enableAutoCancellation && options.requestKey !== null) {
            const requestKey = options.requestKey || (options.method || "GET") + path;
            delete options.requestKey;
            // cancel previous pending requests
            this.cancelRequest(requestKey);
            const controller = new AbortController();
            this.cancelControllers[requestKey] = controller;
            options.signal = controller.signal;
        }
        return options;
    }
    /**
     * Converts analyzes the provided body and converts it to FormData
     * in case a plain object with File/Blob values is used.
     */
    convertToFormDataIfNeeded(body) {
        if (typeof FormData === "undefined" ||
            typeof body === "undefined" ||
            typeof body !== "object" ||
            body === null ||
            this.isFormData(body) ||
            !this.hasBlobField(body)) {
            return body;
        }
        const form = new FormData();
        for (const key in body) {
            const val = body[key];
            if (typeof val === "object" && !this.hasBlobField({ data: val })) {
                // send json-like values as jsonPayload to avoid the implicit string value normalization
                let payload = {};
                payload[key] = val;
                form.append("@jsonPayload", JSON.stringify(payload));
            }
            else {
                // in case of mixed string and file/blob
                const normalizedVal = Array.isArray(val) ? val : [val];
                for (let v of normalizedVal) {
                    form.append(key, v);
                }
            }
        }
        return form;
    }
    /**
     * Checks if the submitted body object has at least one Blob/File field.
     */
    hasBlobField(body) {
        for (const key in body) {
            const values = Array.isArray(body[key]) ? body[key] : [body[key]];
            for (const v of values) {
                if ((typeof Blob !== "undefined" && v instanceof Blob) ||
                    (typeof File !== "undefined" && v instanceof File)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Extracts the header with the provided name in case-insensitive manner.
     * Returns `null` if no header matching the name is found.
     */
    getHeader(headers, name) {
        headers = headers || {};
        name = name.toLowerCase();
        for (let key in headers) {
            if (key.toLowerCase() == name) {
                return headers[key];
            }
        }
        return null;
    }
    /**
     * Loosely checks if the specified body is a FormData instance.
     */
    isFormData(body) {
        return (body &&
            // we are checking the constructor name because FormData
            // is not available natively in some environments and the
            // polyfill(s) may not be globally accessible
            (body.constructor.name === "FormData" ||
                // fallback to global FormData instance check
                // note: this is needed because the constructor.name could be different in case of
                //       custom global FormData implementation, eg. React Native on Android/iOS
                (typeof FormData !== "undefined" && body instanceof FormData)));
    }
    /**
     * Serializes the provided query parameters into a query string.
     */
    serializeQueryParams(params) {
        const result = [];
        for (const key in params) {
            if (params[key] === null) {
                // skip null query params
                continue;
            }
            const value = params[key];
            const encodedKey = encodeURIComponent(key);
            if (Array.isArray(value)) {
                // repeat array params
                for (const v of value) {
                    result.push(encodedKey + "=" + encodeURIComponent(v));
                }
            }
            else if (value instanceof Date) {
                result.push(encodedKey + "=" + encodeURIComponent(value.toISOString()));
            }
            else if (typeof value !== null && typeof value === "object") {
                result.push(encodedKey + "=" + encodeURIComponent(JSON.stringify(value)));
            }
            else {
                result.push(encodedKey + "=" + encodeURIComponent(value));
            }
        }
        return result.join("&");
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map
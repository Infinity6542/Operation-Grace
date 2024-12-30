"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordService = void 0;
const jwt_1 = require("@/stores/utils/jwt");
const CrudService_1 = require("@/services/utils/CrudService");
const RealtimeService_1 = require("@/services/RealtimeService");
const ClientResponseError_1 = require("@/ClientResponseError");
const legacy_1 = require("@/services/utils/legacy");
class RecordService extends CrudService_1.CrudService {
    constructor(client, collectionIdOrName) {
        super(client);
        this.collectionIdOrName = collectionIdOrName;
    }
    /**
     * @inheritdoc
     */
    get baseCrudPath() {
        return this.baseCollectionPath + "/records";
    }
    /**
     * Returns the current collection service base path.
     */
    get baseCollectionPath() {
        return "/api/collections/" + encodeURIComponent(this.collectionIdOrName);
    }
    // ---------------------------------------------------------------
    // Realtime handlers
    // ---------------------------------------------------------------
    /**
     * Subscribe to realtime changes to the specified topic ("*" or record id).
     *
     * If `topic` is the wildcard "*", then this method will subscribe to
     * any record changes in the collection.
     *
     * If `topic` is a record id, then this method will subscribe only
     * to changes of the specified record id.
     *
     * It's OK to subscribe multiple times to the same topic.
     * You can use the returned `UnsubscribeFunc` to remove only a single subscription.
     * Or use `unsubscribe(topic)` if you want to remove all subscriptions attached to the topic.
     */
    async subscribe(topic, callback, options) {
        if (!topic) {
            throw new Error("Missing topic.");
        }
        if (!callback) {
            throw new Error("Missing subscription callback.");
        }
        return this.client.realtime.subscribe(this.collectionIdOrName + "/" + topic, callback, options);
    }
    /**
     * Unsubscribe from all subscriptions of the specified topic
     * ("*" or record id).
     *
     * If `topic` is not set, then this method will unsubscribe from
     * all subscriptions associated to the current collection.
     */
    async unsubscribe(topic) {
        // unsubscribe from the specified topic
        if (topic) {
            return this.client.realtime.unsubscribe(this.collectionIdOrName + "/" + topic);
        }
        // unsubscribe from everything related to the collection
        return this.client.realtime.unsubscribeByPrefix(this.collectionIdOrName);
    }
    /**
     * @inheritdoc
     */
    async getFullList(batchOrOptions, options) {
        if (typeof batchOrOptions == "number") {
            return super.getFullList(batchOrOptions, options);
        }
        const params = Object.assign({}, batchOrOptions, options);
        return super.getFullList(params);
    }
    /**
     * @inheritdoc
     */
    async getList(page = 1, perPage = 30, options) {
        return super.getList(page, perPage, options);
    }
    /**
     * @inheritdoc
     */
    async getFirstListItem(filter, options) {
        return super.getFirstListItem(filter, options);
    }
    /**
     * @inheritdoc
     */
    async getOne(id, options) {
        return super.getOne(id, options);
    }
    /**
     * @inheritdoc
     */
    async create(bodyParams, options) {
        return super.create(bodyParams, options);
    }
    /**
     * @inheritdoc
     *
     * If the current `client.authStore.model` matches with the updated id, then
     * on success the `client.authStore.model` will be updated with the result.
     */
    async update(id, bodyParams, options) {
        return super.update(id, bodyParams, options).then((item) => {
            var _a, _b, _c;
            if (
            // is record auth
            ((_a = this.client.authStore.model) === null || _a === void 0 ? void 0 : _a.id) === (item === null || item === void 0 ? void 0 : item.id) &&
                (((_b = this.client.authStore.model) === null || _b === void 0 ? void 0 : _b.collectionId) === this.collectionIdOrName ||
                    ((_c = this.client.authStore.model) === null || _c === void 0 ? void 0 : _c.collectionName) ===
                        this.collectionIdOrName)) {
                this.client.authStore.save(this.client.authStore.token, item);
            }
            return item;
        });
    }
    /**
     * @inheritdoc
     *
     * If the current `client.authStore.model` matches with the deleted id,
     * then on success the `client.authStore` will be cleared.
     */
    async delete(id, options) {
        return super.delete(id, options).then((success) => {
            var _a, _b, _c;
            if (success &&
                // is record auth
                ((_a = this.client.authStore.model) === null || _a === void 0 ? void 0 : _a.id) === id &&
                (((_b = this.client.authStore.model) === null || _b === void 0 ? void 0 : _b.collectionId) === this.collectionIdOrName ||
                    ((_c = this.client.authStore.model) === null || _c === void 0 ? void 0 : _c.collectionName) ===
                        this.collectionIdOrName)) {
                this.client.authStore.clear();
            }
            return success;
        });
    }
    // ---------------------------------------------------------------
    // Auth handlers
    // ---------------------------------------------------------------
    /**
     * Prepare successful collection authorization response.
     */
    authResponse(responseData) {
        const record = this.decode((responseData === null || responseData === void 0 ? void 0 : responseData.record) || {});
        this.client.authStore.save(responseData === null || responseData === void 0 ? void 0 : responseData.token, record);
        return Object.assign({}, responseData, {
            // normalize common fields
            token: (responseData === null || responseData === void 0 ? void 0 : responseData.token) || "",
            record: record,
        });
    }
    /**
     * Returns all available collection auth methods.
     *
     * @throws {ClientResponseError}
     */
    async listAuthMethods(options) {
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client
            .send(this.baseCollectionPath + "/auth-methods", options)
            .then((responseData) => {
            return Object.assign({}, responseData, {
                // normalize common fields
                usernamePassword: !!(responseData === null || responseData === void 0 ? void 0 : responseData.usernamePassword),
                emailPassword: !!(responseData === null || responseData === void 0 ? void 0 : responseData.emailPassword),
                authProviders: Array.isArray(responseData === null || responseData === void 0 ? void 0 : responseData.authProviders)
                    ? responseData === null || responseData === void 0 ? void 0 : responseData.authProviders
                    : [],
            });
        });
    }
    async authWithPassword(usernameOrEmail, password, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                identity: usernameOrEmail,
                password: password,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of authWithPassword(usernameOrEmail, pass, body?, query?) is deprecated. Consider replacing it with authWithPassword(usernameOrEmail, pass, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/auth-with-password", options)
            .then((data) => this.authResponse(data));
    }
    async authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                provider: provider,
                code: code,
                codeVerifier: codeVerifier,
                redirectUrl: redirectUrl,
                createData: createData,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData?, body?, query?) is deprecated. Consider replacing it with authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData?, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/auth-with-oauth2", options)
            .then((data) => this.authResponse(data));
    }
    async authWithOAuth2(...args) {
        // fallback to legacy format
        if (args.length > 1 || typeof (args === null || args === void 0 ? void 0 : args[0]) === "string") {
            console.warn("PocketBase: This form of authWithOAuth2() is deprecated and may get removed in the future. Please replace with authWithOAuth2Code() OR use the authWithOAuth2() realtime form as shown in https://pocketbase.io/docs/authentication/#oauth2-integration.");
            return this.authWithOAuth2Code((args === null || args === void 0 ? void 0 : args[0]) || "", (args === null || args === void 0 ? void 0 : args[1]) || "", (args === null || args === void 0 ? void 0 : args[2]) || "", (args === null || args === void 0 ? void 0 : args[3]) || "", (args === null || args === void 0 ? void 0 : args[4]) || {}, (args === null || args === void 0 ? void 0 : args[5]) || {}, (args === null || args === void 0 ? void 0 : args[6]) || {});
        }
        const config = (args === null || args === void 0 ? void 0 : args[0]) || {};
        const authMethods = await this.listAuthMethods();
        const provider = authMethods.authProviders.find((p) => p.name === config.provider);
        if (!provider) {
            throw new ClientResponseError_1.ClientResponseError(new Error(`Missing or invalid provider "${config.provider}".`));
        }
        const redirectUrl = this.client.buildUrl("/api/oauth2-redirect");
        // initialize a one-off realtime service
        const realtime = new RealtimeService_1.RealtimeService(this.client);
        // open a new popup window in case config.urlCallback is not set
        //
        // note: it is opened before the async call due to Safari restrictions
        // (see https://github.com/pocketbase/pocketbase/discussions/2429#discussioncomment-5943061)
        let eagerDefaultPopup = null;
        if (!config.urlCallback) {
            eagerDefaultPopup = openBrowserPopup(undefined);
        }
        function cleanup() {
            eagerDefaultPopup === null || eagerDefaultPopup === void 0 ? void 0 : eagerDefaultPopup.close();
            realtime.unsubscribe();
        }
        return new Promise(async (resolve, reject) => {
            var _a;
            try {
                await realtime.subscribe("@oauth2", async (e) => {
                    const oldState = realtime.clientId;
                    try {
                        if (!e.state || oldState !== e.state) {
                            throw new Error("State parameters don't match.");
                        }
                        if (e.error || !e.code) {
                            throw new Error("OAuth2 redirect error or missing code: " + e.error);
                        }
                        // clear the non SendOptions props
                        const options = Object.assign({}, config);
                        delete options.provider;
                        delete options.scopes;
                        delete options.createData;
                        delete options.urlCallback;
                        const authData = await this.authWithOAuth2Code(provider.name, e.code, provider.codeVerifier, redirectUrl, config.createData, options);
                        resolve(authData);
                    }
                    catch (err) {
                        reject(new ClientResponseError_1.ClientResponseError(err));
                    }
                    cleanup();
                });
                const replacements = {
                    state: realtime.clientId,
                };
                if ((_a = config.scopes) === null || _a === void 0 ? void 0 : _a.length) {
                    replacements["scope"] = config.scopes.join(" ");
                }
                const url = this._replaceQueryParams(provider.authUrl + redirectUrl, replacements);
                let urlCallback = config.urlCallback ||
                    function (url) {
                        if (eagerDefaultPopup) {
                            eagerDefaultPopup.location.href = url;
                        }
                        else {
                            // it could have been blocked due to its empty initial url,
                            // try again...
                            eagerDefaultPopup = openBrowserPopup(url);
                        }
                    };
                await urlCallback(url);
            }
            catch (err) {
                cleanup();
                reject(new ClientResponseError_1.ClientResponseError(err));
            }
        });
    }
    async authRefresh(bodyOrOptions, query) {
        let options = {
            method: "POST",
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of authRefresh(body?, query?) is deprecated. Consider replacing it with authRefresh(options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/auth-refresh", options)
            .then((data) => this.authResponse(data));
    }
    async requestPasswordReset(email, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                email: email,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of requestPasswordReset(email, body?, query?) is deprecated. Consider replacing it with requestPasswordReset(email, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/request-password-reset", options)
            .then(() => true);
    }
    async confirmPasswordReset(passwordResetToken, password, passwordConfirm, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                token: passwordResetToken,
                password: password,
                passwordConfirm: passwordConfirm,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of confirmPasswordReset(token, password, passwordConfirm, body?, query?) is deprecated. Consider replacing it with confirmPasswordReset(token, password, passwordConfirm, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/confirm-password-reset", options)
            .then(() => true);
    }
    async requestVerification(email, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                email: email,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of requestVerification(email, body?, query?) is deprecated. Consider replacing it with requestVerification(email, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/request-verification", options)
            .then(() => true);
    }
    async confirmVerification(verificationToken, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                token: verificationToken,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of confirmVerification(token, body?, query?) is deprecated. Consider replacing it with confirmVerification(token, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/confirm-verification", options)
            .then(() => {
            // on success manually update the current auth record verified state
            const payload = (0, jwt_1.getTokenPayload)(verificationToken);
            const model = this.client.authStore.model;
            if (model &&
                !model.verified &&
                model.id === payload.id &&
                model.collectionId === payload.collectionId) {
                model.verified = true;
                this.client.authStore.save(this.client.authStore.token, model);
            }
            return true;
        });
    }
    async requestEmailChange(newEmail, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                newEmail: newEmail,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of requestEmailChange(newEmail, body?, query?) is deprecated. Consider replacing it with requestEmailChange(newEmail, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/request-email-change", options)
            .then(() => true);
    }
    async confirmEmailChange(emailChangeToken, password, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                token: emailChangeToken,
                password: password,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of confirmEmailChange(token, password, body?, query?) is deprecated. Consider replacing it with confirmEmailChange(token, password, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCollectionPath + "/confirm-email-change", options)
            .then(() => {
            const payload = (0, jwt_1.getTokenPayload)(emailChangeToken);
            const model = this.client.authStore.model;
            if (model &&
                model.id === payload.id &&
                model.collectionId === payload.collectionId) {
                this.client.authStore.clear();
            }
            return true;
        });
    }
    /**
     * Lists all linked external auth providers for the specified auth record.
     *
     * @throws {ClientResponseError}
     */
    async listExternalAuths(recordId, options) {
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client.send(this.baseCrudPath + "/" + encodeURIComponent(recordId) + "/external-auths", options);
    }
    /**
     * Unlink a single external auth provider from the specified auth record.
     *
     * @throws {ClientResponseError}
     */
    async unlinkExternalAuth(recordId, provider, options) {
        options = Object.assign({
            method: "DELETE",
        }, options);
        return this.client
            .send(this.baseCrudPath +
            "/" +
            encodeURIComponent(recordId) +
            "/external-auths/" +
            encodeURIComponent(provider), options)
            .then(() => true);
    }
    // ---------------------------------------------------------------
    // very rudimentary url query params replacement because at the moment
    // URL (and URLSearchParams) doesn't seem to be fully supported in React Native
    //
    // note: for details behind some of the decode/encode parsing check https://unixpapa.com/js/querystring.html
    _replaceQueryParams(url, replacements = {}) {
        let urlPath = url;
        let query = "";
        const queryIndex = url.indexOf("?");
        if (queryIndex >= 0) {
            urlPath = url.substring(0, url.indexOf("?"));
            query = url.substring(url.indexOf("?") + 1);
        }
        const parsedParams = {};
        // parse the query parameters
        const rawParams = query.split("&");
        for (const param of rawParams) {
            if (param == "") {
                continue;
            }
            const pair = param.split("=");
            parsedParams[decodeURIComponent(pair[0].replace(/\+/g, " "))] =
                decodeURIComponent((pair[1] || "").replace(/\+/g, " "));
        }
        // apply the replacements
        for (let key in replacements) {
            if (!replacements.hasOwnProperty(key)) {
                continue;
            }
            if (replacements[key] == null) {
                delete parsedParams[key];
            }
            else {
                parsedParams[key] = replacements[key];
            }
        }
        // construct back the full query string
        query = "";
        for (let key in parsedParams) {
            if (!parsedParams.hasOwnProperty(key)) {
                continue;
            }
            if (query != "") {
                query += "&";
            }
            query +=
                encodeURIComponent(key.replace(/%20/g, "+")) +
                    "=" +
                    encodeURIComponent(parsedParams[key].replace(/%20/g, "+"));
        }
        return query != "" ? urlPath + "?" + query : urlPath;
    }
}
exports.RecordService = RecordService;
function openBrowserPopup(url) {
    if (typeof window === "undefined" || !(window === null || window === void 0 ? void 0 : window.open)) {
        throw new ClientResponseError_1.ClientResponseError(new Error(`Not in a browser context - please pass a custom urlCallback function.`));
    }
    let width = 1024;
    let height = 768;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    // normalize window size
    width = width > windowWidth ? windowWidth : width;
    height = height > windowHeight ? windowHeight : height;
    let left = windowWidth / 2 - width / 2;
    let top = windowHeight / 2 - height / 2;
    // note: we don't use the noopener and noreferrer attributes since
    // for some reason browser blocks such windows then url is undefined/blank
    return window.open(url, "popup_window", "width=" +
        width +
        ",height=" +
        height +
        ",top=" +
        top +
        ",left=" +
        left +
        ",resizable,menubar=no");
}
//# sourceMappingURL=RecordService.js.map
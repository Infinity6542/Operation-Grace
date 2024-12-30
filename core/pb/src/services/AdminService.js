"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const CrudService_1 = require("@/services/utils/CrudService");
const legacy_1 = require("@/services/utils/legacy");
const refresh_1 = require("@/services/utils/refresh");
class AdminService extends CrudService_1.CrudService {
    /**
     * @inheritdoc
     */
    get baseCrudPath() {
        return "/api/admins";
    }
    // ---------------------------------------------------------------
    // Post update/delete AuthStore sync
    // ---------------------------------------------------------------
    /**
     * @inheritdoc
     *
     * If the current `client.authStore.model` matches with the updated id, then
     * on success the `client.authStore.model` will be updated with the result.
     */
    async update(id, bodyParams, options) {
        return super.update(id, bodyParams, options).then((item) => {
            var _a, _b;
            // update the store state if the updated item id matches with the stored model
            if (((_a = this.client.authStore.model) === null || _a === void 0 ? void 0 : _a.id) === item.id &&
                typeof ((_b = this.client.authStore.model) === null || _b === void 0 ? void 0 : _b.collectionId) === "undefined" // is not record auth
            ) {
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
            var _a, _b;
            // clear the store state if the deleted item id matches with the stored model
            if (success &&
                ((_a = this.client.authStore.model) === null || _a === void 0 ? void 0 : _a.id) === id &&
                typeof ((_b = this.client.authStore.model) === null || _b === void 0 ? void 0 : _b.collectionId) === "undefined" // is not record auth
            ) {
                this.client.authStore.clear();
            }
            return success;
        });
    }
    // ---------------------------------------------------------------
    // Auth handlers
    // ---------------------------------------------------------------
    /**
     * Prepare successful authorize response.
     */
    authResponse(responseData) {
        const admin = this.decode((responseData === null || responseData === void 0 ? void 0 : responseData.admin) || {});
        if ((responseData === null || responseData === void 0 ? void 0 : responseData.token) && (responseData === null || responseData === void 0 ? void 0 : responseData.admin)) {
            this.client.authStore.save(responseData.token, admin);
        }
        return Object.assign({}, responseData, {
            // normalize common fields
            token: (responseData === null || responseData === void 0 ? void 0 : responseData.token) || "",
            admin: admin,
        });
    }
    async authWithPassword(email, password, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                identity: email,
                password: password,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of authWithPassword(email, pass, body?, query?) is deprecated. Consider replacing it with authWithPassword(email, pass, options?).", options, bodyOrOptions, query);
        const autoRefreshThreshold = options.autoRefreshThreshold;
        delete options.autoRefreshThreshold;
        // not from auto refresh reauthentication
        if (!options.autoRefresh) {
            (0, refresh_1.resetAutoRefresh)(this.client);
        }
        let authData = await this.client.send(this.baseCrudPath + "/auth-with-password", options);
        authData = this.authResponse(authData);
        if (autoRefreshThreshold) {
            (0, refresh_1.registerAutoRefresh)(this.client, autoRefreshThreshold, () => this.authRefresh({ autoRefresh: true }), () => this.authWithPassword(email, password, Object.assign({ autoRefresh: true }, options)));
        }
        return authData;
    }
    async authRefresh(bodyOrOptions, query) {
        let options = {
            method: "POST",
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of authRefresh(body?, query?) is deprecated. Consider replacing it with authRefresh(options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCrudPath + "/auth-refresh", options)
            .then(this.authResponse.bind(this));
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
            .send(this.baseCrudPath + "/request-password-reset", options)
            .then(() => true);
    }
    async confirmPasswordReset(resetToken, password, passwordConfirm, bodyOrOptions, query) {
        let options = {
            method: "POST",
            body: {
                token: resetToken,
                password: password,
                passwordConfirm: passwordConfirm,
            },
        };
        options = (0, legacy_1.normalizeLegacyOptionsArgs)("This form of confirmPasswordReset(resetToken, password, passwordConfirm, body?, query?) is deprecated. Consider replacing it with confirmPasswordReset(resetToken, password, passwordConfirm, options?).", options, bodyOrOptions, query);
        return this.client
            .send(this.baseCrudPath + "/confirm-password-reset", options)
            .then(() => true);
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=AdminService.js.map
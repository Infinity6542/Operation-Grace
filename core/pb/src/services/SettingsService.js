"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const BaseService_1 = require("@/services/utils/BaseService");
class SettingsService extends BaseService_1.BaseService {
    /**
     * Fetch all available app settings.
     *
     * @throws {ClientResponseError}
     */
    async getAll(options) {
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client.send("/api/settings", options);
    }
    /**
     * Bulk updates app settings.
     *
     * @throws {ClientResponseError}
     */
    async update(bodyParams, options) {
        options = Object.assign({
            method: "PATCH",
            body: bodyParams,
        }, options);
        return this.client.send("/api/settings", options);
    }
    /**
     * Performs a S3 filesystem connection test.
     *
     * The currently supported `filesystem` are "storage" and "backups".
     *
     * @throws {ClientResponseError}
     */
    async testS3(filesystem = "storage", options) {
        options = Object.assign({
            method: "POST",
            body: {
                filesystem: filesystem,
            },
        }, options);
        return this.client.send("/api/settings/test/s3", options).then(() => true);
    }
    /**
     * Sends a test email.
     *
     * The possible `emailTemplate` values are:
     * - verification
     * - password-reset
     * - email-change
     *
     * @throws {ClientResponseError}
     */
    async testEmail(toEmail, emailTemplate, options) {
        options = Object.assign({
            method: "POST",
            body: {
                email: toEmail,
                template: emailTemplate,
            },
        }, options);
        return this.client.send("/api/settings/test/email", options).then(() => true);
    }
    /**
     * Generates a new Apple OAuth2 client secret.
     *
     * @throws {ClientResponseError}
     */
    async generateAppleClientSecret(clientId, teamId, keyId, privateKey, duration, options) {
        options = Object.assign({
            method: "POST",
            body: {
                clientId,
                teamId,
                keyId,
                privateKey,
                duration,
            },
        }, options);
        return this.client.send("/api/settings/apple/generate-client-secret", options);
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=SettingsService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const BaseService_1 = require("@/services/utils/BaseService");
class BackupService extends BaseService_1.BaseService {
    /**
     * Returns list with all available backup files.
     *
     * @throws {ClientResponseError}
     */
    async getFullList(options) {
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client.send("/api/backups", options);
    }
    /**
     * Initializes a new backup.
     *
     * @throws {ClientResponseError}
     */
    async create(basename, options) {
        options = Object.assign({
            method: "POST",
            body: {
                name: basename,
            },
        }, options);
        return this.client.send("/api/backups", options).then(() => true);
    }
    /**
     * Uploads an existing backup file.
     *
     * Example:
     *
     * ```js
     * await pb.backups.upload({
     *     file: new Blob([...]),
     * });
     * ```
     *
     * @throws {ClientResponseError}
     */
    async upload(bodyParams, options) {
        options = Object.assign({
            method: "POST",
            body: bodyParams,
        }, options);
        return this.client.send("/api/backups/upload", options).then(() => true);
    }
    /**
     * Deletes a single backup file.
     *
     * @throws {ClientResponseError}
     */
    async delete(key, options) {
        options = Object.assign({
            method: "DELETE",
        }, options);
        return this.client
            .send(`/api/backups/${encodeURIComponent(key)}`, options)
            .then(() => true);
    }
    /**
     * Initializes an app data restore from an existing backup.
     *
     * @throws {ClientResponseError}
     */
    async restore(key, options) {
        options = Object.assign({
            method: "POST",
        }, options);
        return this.client
            .send(`/api/backups/${encodeURIComponent(key)}/restore`, options)
            .then(() => true);
    }
    /**
     * Builds a download url for a single existing backup using an
     * admin file token and the backup file key.
     *
     * The file token can be generated via `pb.files.getToken()`.
     */
    getDownloadUrl(token, key) {
        return this.client.buildUrl(`/api/backups/${encodeURIComponent(key)}?token=${encodeURIComponent(token)}`);
    }
}
exports.BackupService = BackupService;
//# sourceMappingURL=BackupService.js.map
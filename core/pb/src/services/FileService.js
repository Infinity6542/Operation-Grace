"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const BaseService_1 = require("@/services/utils/BaseService");
class FileService extends BaseService_1.BaseService {
    /**
     * Builds and returns an absolute record file url for the provided filename.
     */
    getUrl(record, filename, queryParams = {}) {
        if (!filename ||
            !(record === null || record === void 0 ? void 0 : record.id) ||
            !((record === null || record === void 0 ? void 0 : record.collectionId) || (record === null || record === void 0 ? void 0 : record.collectionName))) {
            return "";
        }
        const parts = [];
        parts.push("api");
        parts.push("files");
        parts.push(encodeURIComponent(record.collectionId || record.collectionName));
        parts.push(encodeURIComponent(record.id));
        parts.push(encodeURIComponent(filename));
        let result = this.client.buildUrl(parts.join("/"));
        if (Object.keys(queryParams).length) {
            // normalize the download query param for consistency with the Dart sdk
            if (queryParams.download === false) {
                delete queryParams.download;
            }
            const params = new URLSearchParams(queryParams);
            result += (result.includes("?") ? "&" : "?") + params;
        }
        return result;
    }
    /**
     * Requests a new private file access token for the current auth model (admin or record).
     *
     * @throws {ClientResponseError}
     */
    async getToken(options) {
        options = Object.assign({
            method: "POST",
        }, options);
        return this.client
            .send("/api/files/token", options)
            .then((data) => (data === null || data === void 0 ? void 0 : data.token) || "");
    }
}
exports.FileService = FileService;
//# sourceMappingURL=FileService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const ClientResponseError_1 = require("@/ClientResponseError");
const BaseService_1 = require("@/services/utils/BaseService");
class LogService extends BaseService_1.BaseService {
    /**
     * Returns paginated logs list.
     *
     * @throws {ClientResponseError}
     */
    async getList(page = 1, perPage = 30, options) {
        options = Object.assign({ method: "GET" }, options);
        options.query = Object.assign({
            page: page,
            perPage: perPage,
        }, options.query);
        return this.client.send("/api/logs", options);
    }
    /**
     * Returns a single log by its id.
     *
     * If `id` is empty it will throw a 404 error.
     *
     * @throws {ClientResponseError}
     */
    async getOne(id, options) {
        if (!id) {
            throw new ClientResponseError_1.ClientResponseError({
                url: this.client.buildUrl("/api/logs/"),
                status: 404,
                response: {
                    code: 404,
                    message: "Missing required log id.",
                    data: {},
                },
            });
        }
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client.send("/api/logs/" + encodeURIComponent(id), options);
    }
    /**
     * Returns logs statistics.
     *
     * @throws {ClientResponseError}
     */
    async getStats(options) {
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client.send("/api/logs/stats", options);
    }
}
exports.LogService = LogService;
//# sourceMappingURL=LogService.js.map
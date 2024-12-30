"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const BaseService_1 = require("@/services/utils/BaseService");
class HealthService extends BaseService_1.BaseService {
    /**
     * Checks the health status of the api.
     *
     * @throws {ClientResponseError}
     */
    async check(options) {
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client.send("/api/health", options);
    }
}
exports.HealthService = HealthService;
//# sourceMappingURL=HealthService.js.map
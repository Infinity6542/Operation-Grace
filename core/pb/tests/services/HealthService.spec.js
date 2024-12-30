"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mocks_1 = require("../mocks");
const Client_1 = require("@/Client");
const HealthService_1 = require("@/services/HealthService");
(0, vitest_1.describe)("HealthService", function () {
    const client = new Client_1.default("test_base_url");
    const service = new HealthService_1.HealthService(client);
    const fetchMock = new mocks_1.FetchMock();
    (0, vitest_1.beforeAll)(function () {
        fetchMock.init();
    });
    (0, vitest_1.afterAll)(function () {
        fetchMock.restore();
    });
    (0, vitest_1.afterEach)(function () {
        fetchMock.clearMocks();
    });
    (0, vitest_1.describe)("check()", function () {
        (0, vitest_1.test)("Should fetch all app settings", async function () {
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/api/health") + "?q1=123",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: { code: 200, message: "test", data: {} },
            });
            const result = await service.check({ q1: 123, headers: { "x-test": "456" } });
            vitest_1.assert.deepEqual(result, { code: 200, message: "test", data: {} });
        });
    });
});
//# sourceMappingURL=HealthService.spec.js.map
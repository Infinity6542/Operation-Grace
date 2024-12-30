"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mocks_1 = require("../mocks");
const Client_1 = require("@/Client");
const LogService_1 = require("@/services/LogService");
(0, vitest_1.describe)("LogService", function () {
    const client = new Client_1.default("test_base_url");
    const service = new LogService_1.LogService(client);
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
    (0, vitest_1.describe)("getList()", function () {
        (0, vitest_1.test)("Should correctly return paginated list result", async function () {
            const replyBody = {
                page: 2,
                perPage: 1,
                totalItems: 3,
                totalPages: 3,
                items: [{ id: "test123" }],
            };
            fetchMock.on({
                method: "GET",
                url: "test_base_url/api/logs?page=2&perPage=1&q1=abc",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: replyBody,
            });
            const list = await service.getList(2, 1, {
                q1: "abc",
                headers: { "x-test": "456" },
            });
            vitest_1.assert.deepEqual(list, replyBody);
        });
    });
    (0, vitest_1.describe)("getOne()", function () {
        (0, vitest_1.test)("Should return single log", async function () {
            fetchMock.on({
                method: "GET",
                url: "test_base_url/api/logs/" +
                    encodeURIComponent("test?123") +
                    "?q1=abc",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: { id: "test123" },
            });
            const result = await service.getOne("test?123", {
                q1: "abc",
                headers: { "x-test": "456" },
            });
            vitest_1.assert.deepEqual(result, { id: "test123" });
        });
        (0, vitest_1.test)("Should return a 404 error if id is empty", async function () {
            (0, vitest_1.expect)(service.getOne("")).rejects.toThrow("Missing required log id.");
            (0, vitest_1.expect)(service.getOne(null)).rejects.toThrow("Missing required log id.");
            (0, vitest_1.expect)(service.getOne(undefined)).rejects.toThrow("Missing required log id.");
        });
    });
    (0, vitest_1.describe)("getStats()", function () {
        (0, vitest_1.test)("Should return array with date grouped logs", async function () {
            fetchMock.on({
                method: "GET",
                url: "test_base_url/api/logs/stats?q1=abc",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: [{ total: 123, date: "2022-01-01 00:00:00" }],
            });
            const result = await service.getStats({
                q1: "abc",
                headers: { "x-test": "456" },
            });
            const expected = [{ total: 123, date: "2022-01-01 00:00:00" }];
            vitest_1.assert.deepEqual(result, expected);
        });
    });
});
//# sourceMappingURL=LogService.spec.js.map
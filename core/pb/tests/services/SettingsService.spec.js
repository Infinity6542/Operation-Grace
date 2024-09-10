"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mocks_1 = require("../mocks");
const Client_1 = require("@/Client");
const SettingsService_1 = require("@/services/SettingsService");
(0, vitest_1.describe)("SettingsService", function () {
    const client = new Client_1.default("test_base_url");
    const service = new SettingsService_1.SettingsService(client);
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
    (0, vitest_1.describe)("getAll()", function () {
        (0, vitest_1.test)("Should fetch all app settings", async function () {
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/api/settings") + "?q1=123",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: { test: "abc" },
            });
            const result = await service.getAll({
                q1: 123,
                headers: { "x-test": "456" },
            });
            vitest_1.assert.deepEqual(result, { test: "abc" });
        });
    });
    (0, vitest_1.describe)("update()", function () {
        (0, vitest_1.test)("Should send bulk app settings update", async function () {
            fetchMock.on({
                method: "PATCH",
                url: service.client.buildUrl("/api/settings"),
                body: { b1: 123 },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: { test: "abc" },
            });
            const result = await service.update({ b1: 123 }, { headers: { "x-test": "456" } });
            vitest_1.assert.deepEqual(result, { test: "abc" });
        });
    });
    (0, vitest_1.describe)("testS3()", function () {
        (0, vitest_1.test)("Should send S3 connection test request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/settings/test/s3") + "?q1=123",
                body: { filesystem: "storage" },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.testS3("storage", {
                q1: 123,
                headers: { "x-test": "456" },
            });
            vitest_1.assert.isTrue(result);
        });
    });
    (0, vitest_1.describe)("testEmail()", function () {
        (0, vitest_1.test)("Should send a test email request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/settings/test/email") + "?q1=123",
                body: { template: "abc", email: "test@example.com" },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.testEmail("test@example.com", "abc", {
                q1: 123,
                headers: { "x-test": "456" },
            });
            vitest_1.assert.isTrue(result);
        });
    });
    (0, vitest_1.describe)("generateAppleClientSecret()", function () {
        (0, vitest_1.test)("Should send an Apple OAuth2 client secret request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/settings/apple/generate-client-secret") + "?q1=123",
                body: {
                    clientId: "1",
                    teamId: "2",
                    keyId: "3",
                    privateKey: "4",
                    duration: 5,
                },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 204,
                replyBody: { secret: "test" },
            });
            const result = await service.generateAppleClientSecret("1", "2", "3", "4", 5, {
                q1: 123,
                headers: { "x-test": "456" },
            });
            vitest_1.assert.deepEqual(result, { secret: "test" });
        });
    });
});
//# sourceMappingURL=SettingsService.spec.js.map
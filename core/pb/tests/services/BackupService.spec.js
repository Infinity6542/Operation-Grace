"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mocks_1 = require("../mocks");
const Client_1 = require("@/Client");
const BackupService_1 = require("@/services/BackupService");
(0, vitest_1.describe)("BackupService", function () {
    const client = new Client_1.default("test_base_url");
    const service = new BackupService_1.BackupService(client);
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
    (0, vitest_1.describe)("getFullList()", function () {
        (0, vitest_1.test)("Should fetch all backups", async function () {
            const replyBody = [
                { key: "test1", size: 100, modified: "2023-05-18 10:00:00.123Z" },
                { key: "test2", size: 200, modified: "2023-05-18 11:00:00.123Z" },
            ];
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/api/backups") + "?q1=123",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 200,
                replyBody: replyBody,
            });
            const result = await service.getFullList({
                q1: 123,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.deepEqual(result, replyBody);
        });
    });
    (0, vitest_1.describe)("create()", function () {
        (0, vitest_1.test)("Should initialize a backup create", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/backups") + "?q1=123",
                body: { name: "@test" },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.create("@test", {
                q1: 123,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.deepEqual(result, true);
        });
    });
    (0, vitest_1.describe)("upload()", function () {
        (0, vitest_1.test)("Should upload a backup", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/backups/upload") + "?q1=123",
                body: { file: "123" },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.upload({ file: "123" }, { q1: 123, headers: { "x-test": "123" } });
            vitest_1.assert.deepEqual(result, true);
        });
    });
    (0, vitest_1.describe)("delete()", function () {
        (0, vitest_1.test)("Should delete a single backup", async function () {
            fetchMock.on({
                method: "DELETE",
                url: service.client.buildUrl("/api/backups") + "/%40test?q1=123",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.delete("@test", {
                q1: 123,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.deepEqual(result, true);
        });
    });
    (0, vitest_1.describe)("restore()", function () {
        (0, vitest_1.test)("Should initialize a backup restore", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/backups") + "/%40test/restore?q1=123",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.restore("@test", {
                q1: 123,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.deepEqual(result, true);
        });
    });
    (0, vitest_1.describe)("getDownloadUrl()", function () {
        (0, vitest_1.test)("Should initialize a backup getDownloadUrl", function () {
            const result = service.getDownloadUrl("@token", "@test");
            vitest_1.assert.deepEqual(result, service.client.buildUrl("/api/backups") + "/%40test?token=%40token");
        });
    });
});
//# sourceMappingURL=BackupService.spec.js.map
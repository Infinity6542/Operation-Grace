"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mocks_1 = require("../mocks");
const Client_1 = require("@/Client");
const FileService_1 = require("@/services/FileService");
(0, vitest_1.describe)("FileService", function () {
    const client = new Client_1.default("test_base_url");
    const service = new FileService_1.FileService(client);
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
    (0, vitest_1.describe)("getFileUrl()", function () {
        (0, vitest_1.test)("Should return empty string (missing record id)", async function () {
            const record = { id: "", collectionId: "123", collectionName: "789" };
            const result = service.getUrl(record, "demo.png");
            vitest_1.assert.deepEqual(result, "");
        });
        (0, vitest_1.test)("Should return empty string (missing filename)", async function () {
            const record = { id: "456", collectionId: "123", collectionName: "789" };
            const result = service.getUrl(record, "");
            vitest_1.assert.deepEqual(result, "");
        });
        (0, vitest_1.test)("Should return a formatted url", async function () {
            const record = { id: "456", collectionId: "123", collectionName: "789" };
            const result = service.getUrl(record, "demo.png");
            vitest_1.assert.deepEqual(result, "test_base_url/api/files/123/456/demo.png");
        });
        (0, vitest_1.test)("Should return a formatted url + query params", async function () {
            const record = { id: "456", collectionId: "123", collectionName: "789" };
            const result = service.getUrl(record, "demo=", { test: "abc" });
            vitest_1.assert.deepEqual(result, "test_base_url/api/files/123/456/demo%3D?test=abc");
        });
    });
    (0, vitest_1.describe)("getToken()", function () {
        (0, vitest_1.test)("Should send a file token request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/files/token") + "?q1=123",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "456";
                },
                replyCode: 200,
                replyBody: { token: "789" },
            });
            const result = await service.getToken({
                q1: 123,
                headers: { "x-test": "456" },
            });
            vitest_1.assert.deepEqual(result, "789");
        });
    });
});
//# sourceMappingURL=FileService.spec.js.map
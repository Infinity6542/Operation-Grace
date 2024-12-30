"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mocks_1 = require("../mocks");
const suites_1 = require("../suites");
const Client_1 = require("@/Client");
const CollectionService_1 = require("@/services/CollectionService");
(0, vitest_1.describe)("CollectionService", function () {
    const client = new Client_1.default("test_base_url");
    const service = new CollectionService_1.CollectionService(client);
    (0, suites_1.crudServiceTestsSuite)(service, "/api/collections");
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
    (0, vitest_1.describe)("import()", function () {
        (0, vitest_1.test)("Should send a bulk import collections request", async function () {
            fetchMock.on({
                method: "PUT",
                url: service.client.buildUrl("/api/collections/import?q1=456"),
                body: {
                    collections: [{ id: "id1" }, { id: "id2" }],
                    deleteMissing: true,
                },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.import([{ id: "id1" }, { id: "id2" }], true, {
                q1: 456,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.deepEqual(result, true);
        });
    });
});
//# sourceMappingURL=CollectionService.spec.js.map
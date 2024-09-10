"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudServiceTestsSuite = crudServiceTestsSuite;
const vitest_1 = require("vitest");
const mocks_1 = require("./mocks");
function crudServiceTestsSuite(service, expectedBasePath) {
    const id = "abc=";
    (0, vitest_1.describe)("CrudServiceTests", function () {
        const fetchMock = new mocks_1.FetchMock();
        (0, vitest_1.beforeAll)(function () {
            fetchMock.init();
        });
        (0, vitest_1.afterAll)(function () {
            fetchMock.restore();
        });
        // Prepare mock data
        // -----------------------------------------------------------
        // getFullList (extra empty request check)
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=1&perPage=1&skipTotal=1&q1=emptyRequest",
            replyCode: 200,
            replyBody: {
                page: 1,
                perPage: 1,
                totalItems: -1,
                totalPages: -1,
                items: [{ id: "item1" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=2&perPage=1&skipTotal=1&q1=emptyRequest",
            replyCode: 200,
            replyBody: {
                page: 2,
                perPage: 1,
                totalItems: -1,
                totalPages: -1,
                items: [{ id: "item2" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=3&perPage=1&skipTotal=1&q1=emptyRequest",
            replyCode: 200,
            replyBody: {
                page: 3,
                perPage: 1,
                totalItems: -1,
                totalPages: -1,
                items: [],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // getFullList (less than batchSize, aka. no extra request)
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=1&perPage=2&skipTotal=1&q1=noEmptyRequest",
            replyCode: 200,
            replyBody: {
                page: 1,
                perPage: 2,
                totalItems: -1,
                totalPages: -1,
                items: [{ id: "item1" }, { id: "item2" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=2&perPage=2&skipTotal=1&q1=noEmptyRequest",
            replyCode: 200,
            replyBody: {
                page: 2,
                perPage: 2,
                totalItems: -1,
                totalPages: -1,
                items: [{ id: "item3" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // getList
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=1&perPage=1&q1=abc",
            replyCode: 200,
            replyBody: {
                page: 1,
                perPage: 1,
                totalItems: 3,
                totalPages: 3,
                items: [{ id: "item1" }, { id: "item2" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=2&perPage=1&q1=abc",
            replyCode: 200,
            replyBody: {
                page: 2,
                perPage: 1,
                totalItems: 3,
                totalPages: 3,
                items: [{ id: "item3" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // getOne
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "/" +
                encodeURIComponent(id) +
                "?q1=abc",
            replyCode: 200,
            replyBody: { id: "item-one" },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // getFirstListItem
        fetchMock.on({
            method: "GET",
            url: service.client.buildUrl(service.baseCrudPath) +
                "?page=1&perPage=1&filter=test%3D123&skipTotal=1&q1=abc",
            replyCode: 200,
            replyBody: {
                page: 1,
                perPage: 1,
                totalItems: -1,
                totalPages: -1,
                items: [{ id: "item1" }],
            },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // create
        fetchMock.on({
            method: "POST",
            url: service.client.buildUrl(service.baseCrudPath) + "?q1=456",
            body: { b1: 123 },
            replyCode: 200,
            replyBody: { id: "item-create" },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // update
        fetchMock.on({
            method: "PATCH",
            url: service.client.buildUrl(service.baseCrudPath) +
                "/" +
                encodeURIComponent(id) +
                "?q1=456",
            body: { b1: 123 },
            replyCode: 200,
            replyBody: { id: "item-update" },
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // delete
        fetchMock.on({
            method: "DELETE",
            url: service.client.buildUrl(service.baseCrudPath) +
                "/" +
                encodeURIComponent(id) +
                "?q1=456",
            replyCode: 204,
            additionalMatcher: (_, config) => {
                var _a;
                return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "789";
            },
        });
        // -----------------------------------------------------------
        (0, vitest_1.describe)("baseCrudPath()", function () {
            (0, vitest_1.test)("Should corectly return the service base crud path", function () {
                vitest_1.assert.equal(service.baseCrudPath, expectedBasePath);
            });
        });
        (0, vitest_1.describe)("getFullList()", function () {
            (0, vitest_1.test)("items.length == batchSize (aka. empty request stop check)", async function () {
                const result = await service.getFullList({
                    batch: 1,
                    q1: "emptyRequest",
                    headers: { "x-test": "789" },
                });
                const expected = [
                    service.decode({ id: "item1" }),
                    service.decode({ id: "item2" }),
                ];
                vitest_1.assert.deepEqual(result, expected);
            });
            (0, vitest_1.test)("items.length < batchSize (aka. no empty request stop check)", async function () {
                const result = await service.getFullList({
                    batch: 2,
                    q1: "noEmptyRequest",
                    headers: { "x-test": "789" },
                });
                const expected = [
                    service.decode({ id: "item1" }),
                    service.decode({ id: "item2" }),
                    service.decode({ id: "item3" }),
                ];
                vitest_1.assert.deepEqual(result, expected);
            });
        });
        (0, vitest_1.describe)("getList()", function () {
            (0, vitest_1.test)("Should correctly return paginated list result", async function () {
                const list = await service.getList(2, 1, {
                    q1: "abc",
                    headers: { "x-test": "789" },
                });
                const expected = [service.decode({ id: "item3" })];
                vitest_1.assert.deepEqual(list, {
                    page: 2,
                    perPage: 1,
                    totalItems: 3,
                    totalPages: 3,
                    items: expected,
                });
            });
        });
        (0, vitest_1.describe)("getFirstListItem()", function () {
            (0, vitest_1.test)("Should return single model item by a filter", async function () {
                const result = await service.getFirstListItem("test=123", {
                    q1: "abc",
                    headers: { "x-test": "789" },
                });
                const expected = service.decode({ id: "item1" });
                vitest_1.assert.deepEqual(result, expected);
            });
        });
        (0, vitest_1.describe)("getOne()", function () {
            (0, vitest_1.test)("Should return single model item by an id", async function () {
                const result = await service.getOne(id, {
                    q1: "abc",
                    headers: { "x-test": "789" },
                });
                const expected = service.decode({ id: "item-one" });
                vitest_1.assert.deepEqual(result, expected);
            });
            (0, vitest_1.test)("Should return a 404 error if id is empty", async function () {
                const options = { q1: "abc", headers: { "x-test": "789" } };
                (0, vitest_1.expect)(service.getOne("", options)).rejects.toThrow("Missing required record id.");
                (0, vitest_1.expect)(service.getOne(null, options)).rejects.toThrow("Missing required record id.");
                (0, vitest_1.expect)(service.getOne(undefined, options)).rejects.toThrow("Missing required record id.");
            });
        });
        (0, vitest_1.describe)("create()", function () {
            (0, vitest_1.test)("Should create new model item", async function () {
                const result = await service.create({ b1: 123 }, { q1: 456, headers: { "x-test": "789" } });
                const expected = service.decode({ id: "item-create" });
                vitest_1.assert.deepEqual(result, expected);
            });
        });
        (0, vitest_1.describe)("update()", function () {
            (0, vitest_1.test)("Should update existing model item", async function () {
                const result = await service.update(id, { b1: 123 }, { q1: 456, headers: { "x-test": "789" } });
                const expected = service.decode({ id: "item-update" });
                vitest_1.assert.deepEqual(result, expected);
            });
        });
        (0, vitest_1.describe)("delete()", function () {
            (0, vitest_1.test)("Should delete single model item", async function () {
                const result = await service.delete(id, {
                    q1: 456,
                    headers: { "x-test": "789" },
                });
                vitest_1.assert.isTrue(result);
            });
        });
    });
}
//# sourceMappingURL=suites.js.map
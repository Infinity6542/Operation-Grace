"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Client_1 = require("@/Client");
const LocalAuthStore_1 = require("@/stores/LocalAuthStore");
const RecordService_1 = require("@/services/RecordService");
const mocks_1 = require("./mocks");
(0, vitest_1.describe)("Client", function () {
    const fetchMock = new mocks_1.FetchMock();
    (0, vitest_1.beforeAll)(function () {
        fetchMock.init();
    });
    (0, vitest_1.afterAll)(function () {
        fetchMock.restore();
    });
    (0, vitest_1.afterEach)(function () {
        fetchMock.clearMocks();
        // restore all window mocks
        global.window = undefined;
    });
    (0, vitest_1.describe)("constructor()", function () {
        (0, vitest_1.test)("Should create a properly configured http client instance", function () {
            const client = new Client_1.default("test_base_url", null, "test_language");
            vitest_1.assert.equal(client.baseUrl, "test_base_url");
            vitest_1.assert.instanceOf(client.authStore, LocalAuthStore_1.LocalAuthStore);
            vitest_1.assert.equal(client.lang, "test_language");
        });
        (0, vitest_1.test)("Should load all api resources", async function () {
            const client = new Client_1.default("test_base_url");
            const baseServices = [
                "admins",
                "collections",
                "logs",
                "settings",
                "realtime",
            ];
            for (const service of baseServices) {
                vitest_1.assert.isNotEmpty(client[service]);
            }
        });
    });
    (0, vitest_1.describe)("collection()", function () {
        (0, vitest_1.test)("Should initialize the related collection record service", function () {
            const client = new Client_1.default("test_base_url");
            const service1 = client.collection("test1");
            const service2 = client.collection("test2");
            const service3 = client.collection("test1"); // same as service1
            vitest_1.assert.instanceOf(service1, RecordService_1.RecordService);
            vitest_1.assert.instanceOf(service2, RecordService_1.RecordService);
            vitest_1.assert.instanceOf(service3, RecordService_1.RecordService);
            vitest_1.assert.equal(service1, service3);
            vitest_1.assert.notEqual(service1, service2);
            vitest_1.assert.equal(service1.baseCrudPath, "/api/collections/test1/records");
            vitest_1.assert.equal(service2.baseCrudPath, "/api/collections/test2/records");
            vitest_1.assert.equal(service3.baseCrudPath, "/api/collections/test1/records");
        });
    });
    (0, vitest_1.describe)("buildUrl()", function () {
        (0, vitest_1.test)("Should properly concatenate path to baseUrl", function () {
            // with trailing slash
            const client1 = new Client_1.default("test_base_url/");
            vitest_1.assert.equal(client1.buildUrl("test123"), "test_base_url/test123");
            vitest_1.assert.equal(client1.buildUrl("/test123"), "test_base_url/test123");
            // no trailing slash
            const client2 = new Client_1.default("test_base_url");
            vitest_1.assert.equal(client2.buildUrl("test123"), "test_base_url/test123");
            vitest_1.assert.equal(client2.buildUrl("/test123"), "test_base_url/test123");
        });
        (0, vitest_1.test)("Should construct an absolute url if window.location is defined", function () {
            global.window = {
                location: {
                    origin: "https://example.com/",
                    pathname: "/sub",
                },
            };
            // with empty base url
            {
                const client = new Client_1.default("");
                vitest_1.assert.equal(client.buildUrl("test123"), "https://example.com/sub/test123");
                vitest_1.assert.equal(client.buildUrl("/test123"), "https://example.com/sub/test123");
            }
            // relative base url with starting slash
            {
                const client = new Client_1.default("/a/b/");
                vitest_1.assert.equal(client.buildUrl("test123"), "https://example.com/a/b/test123");
                vitest_1.assert.equal(client.buildUrl("/test123"), "https://example.com/a/b/test123");
            }
            // relative base url with parent path traversal
            {
                const client = new Client_1.default("../a/b/");
                vitest_1.assert.equal(client.buildUrl("test123"), "https://example.com/sub/../a/b/test123");
                vitest_1.assert.equal(client.buildUrl("/test123"), "https://example.com/sub/../a/b/test123");
            }
            // relative base url without starting slash
            {
                const client = new Client_1.default("a/b/");
                vitest_1.assert.equal(client.buildUrl("test123"), "https://example.com/sub/a/b/test123");
                vitest_1.assert.equal(client.buildUrl("/test123"), "https://example.com/sub/a/b/test123");
            }
            // with explicit HTTP absolute base url
            {
                const client = new Client_1.default("http://example2.com");
                vitest_1.assert.equal(client.buildUrl("test123"), "http://example2.com/test123");
                vitest_1.assert.equal(client.buildUrl("/test123"), "http://example2.com/test123");
            }
            // with explicit HTTPS absolute base url and trailing slash
            {
                const client = new Client_1.default("https://example2.com/");
                vitest_1.assert.equal(client.buildUrl("test123"), "https://example2.com/test123");
                vitest_1.assert.equal(client.buildUrl("/test123"), "https://example2.com/test123");
            }
        });
    });
    (0, vitest_1.describe)("getFileUrl()", function () {
        const client = new Client_1.default("test_base_url");
        (0, vitest_1.test)("Should return a formatted url", async function () {
            const record = { id: "456", collectionId: "123", collectionName: "789" };
            const result = client.getFileUrl(record, "demo.png");
            vitest_1.assert.deepEqual(result, "test_base_url/api/files/123/456/demo.png");
        });
        (0, vitest_1.test)("Should return a formatted url + query params", async function () {
            const record = { id: "456", collectionId: "123", collectionName: "789" };
            const result = client.getFileUrl(record, "demo=", { test: "abc" });
            vitest_1.assert.deepEqual(result, "test_base_url/api/files/123/456/demo%3D?test=abc");
        });
    });
    (0, vitest_1.describe)("filter()", function () {
        (0, vitest_1.test)("filter expression without params", function () {
            const client = new Client_1.default("test_base_url", null, "test_language_A");
            const raw = "a > {:test1} && b = {:test2} || c = {:test2}";
            vitest_1.assert.equal(client.filter(raw), raw);
        });
        (0, vitest_1.test)("filter expression with params that does not match the placeholders", function () {
            const client = new Client_1.default("test_base_url", null, "test_language_A");
            const result = client.filter("a > {:test1} && b = {:test2} || c = {:test2}", {
                test2: "hello",
            });
            vitest_1.assert.equal(result, "a > {:test1} && b = 'hello' || c = 'hello'");
        });
        (0, vitest_1.test)("filter expression with all placeholder types", function () {
            const client = new Client_1.default("test_base_url", null, "test_language_A");
            const params = {
                test1: "a'b'c'",
                test2: null,
                test3: true,
                test4: false,
                test5: 123,
                test6: -123.45,
                test7: 123.45,
                test8: new Date("2023-10-18 10:11:12"),
                test9: [1, 2, 3, "test'123"],
                test10: { a: "test'123" },
            };
            let raw = "";
            for (let key in params) {
                if (raw) {
                    raw += " || ";
                }
                raw += `${key}={:${key}}`;
            }
            vitest_1.assert.equal(client.filter(raw, params), `test1='a\\'b\\'c\\'' || test2=null || test3=true || test4=false || test5=123 || test6=-123.45 || test7=123.45 || test8='2023-10-18 07:11:12.000Z' || test9='[1,2,3,"test\\'123"]' || test10='{"a":"test\\'123"}'`);
        });
    });
    (0, vitest_1.describe)("send()", function () {
        (0, vitest_1.test)("Should build and send http request", async function () {
            const client = new Client_1.default("test_base_url", null, "test_language_A");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                replyCode: 200,
                replyBody: "successGet",
            });
            fetchMock.on({
                method: "POST",
                url: "test_base_url/123",
                replyCode: 200,
                replyBody: "successPost",
            });
            fetchMock.on({
                method: "PUT",
                url: "test_base_url/123",
                replyCode: 200,
                replyBody: "successPut",
            });
            fetchMock.on({
                method: "PATCH",
                url: "test_base_url/123",
                replyCode: 200,
                replyBody: "successPatch",
            });
            fetchMock.on({
                method: "DELETE",
                url: "test_base_url/123",
                replyCode: 200,
                replyBody: "successDelete",
            });
            fetchMock.on({
                method: "GET",
                url: "test_base_url/multipart",
                additionalMatcher: (_, config) => {
                    var _a;
                    // multipart/form-data requests shouldn't have explicitly set Content-Type
                    return !((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Content-Type"]);
                },
                replyCode: 200,
                replyBody: "successMultipart",
            });
            fetchMock.on({
                method: "GET",
                url: "test_base_url/multipartAuto",
                additionalMatcher: (_, config) => {
                    var _a;
                    if (
                    // multipart/form-data requests shouldn't have explicitly set Content-Type
                    ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Content-Type"]) ||
                        // the body should have been converted to FormData
                        !(config.body instanceof FormData)) {
                        return false;
                    }
                    // check FormData transformation
                    vitest_1.assert.deepEqual(config.body.getAll("title"), ["test"]);
                    vitest_1.assert.deepEqual(config.body.getAll("@jsonPayload"), [
                        '{"roles":["a","b"]}',
                        '{"json":null}',
                    ]);
                    vitest_1.assert.equal(config.body.getAll("files").length, 2);
                    vitest_1.assert.equal(config.body.getAll("files")[0].size, 2);
                    vitest_1.assert.equal(config.body.getAll("files")[1].size, 1);
                    return true;
                },
                replyCode: 200,
                replyBody: "successMultipartAuto",
            });
            const testCases = [
                [client.send("/123", { method: "GET" }), "successGet"],
                [client.send("/123", { method: "POST" }), "successPost"],
                [client.send("/123", { method: "PUT" }), "successPut"],
                [client.send("/123", { method: "PATCH" }), "successPatch"],
                [client.send("/123", { method: "DELETE" }), "successDelete"],
                [
                    client.send("/multipart", { method: "GET", body: new FormData() }),
                    "successMultipart",
                ],
                [
                    client.send("/multipartAuto", {
                        method: "GET",
                        body: {
                            title: "test",
                            roles: ["a", "b"],
                            json: null,
                            files: [new Blob(["11"]), new Blob(["2"])],
                        },
                    }),
                    "successMultipartAuto",
                ],
            ];
            for (let testCase of testCases) {
                const responseData = await testCase[0];
                vitest_1.assert.equal(responseData, testCase[1]);
            }
        });
        (0, vitest_1.test)("Should auto add authorization header if missing", async function () {
            const client = new Client_1.default("test_base_url", null, "test_language_A");
            // none
            fetchMock.on({
                method: "GET",
                url: "test_base_url/none",
                additionalMatcher: (_, config) => {
                    var _a;
                    return !((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a.Authorization);
                },
                replyCode: 200,
            });
            await client.send("/none", { method: "GET" });
            // admin token
            fetchMock.on({
                method: "GET",
                url: "test_base_url/admin",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a.Authorization) === "token123";
                },
                replyCode: 200,
            });
            const admin = { id: "test-admin" };
            client.authStore.save("token123", admin);
            await client.send("/admin", { method: "GET" });
            // user token
            fetchMock.on({
                method: "GET",
                url: "test_base_url/user",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a.Authorization) === "token123";
                },
                replyCode: 200,
            });
            const user = { id: "test-user", collectionId: "test-user" };
            client.authStore.save("token123", user);
            await client.send("/user", { method: "GET" });
        });
        (0, vitest_1.test)("Should use a custom fetch function", async function () {
            const client = new Client_1.default("test_base_url");
            let called = 0;
            await client.send("/old?q1=123", {
                q1: 123,
                method: "GET",
                fetch: async () => {
                    called++;
                    return {};
                },
            });
            vitest_1.assert.equal(called, 1);
        });
        (0, vitest_1.test)("Should trigger the before hook", async function () {
            const client = new Client_1.default("test_base_url");
            const newUrl = "test_base_url/new";
            client.beforeSend = function (_, options) {
                options.headers = Object.assign({}, options.headers, {
                    "X-Custom-Header": "456",
                });
                return { url: newUrl, options };
            };
            fetchMock.on({
                method: "GET",
                url: newUrl,
                replyCode: 200,
                replyBody: "123",
                additionalMatcher: function (url, config) {
                    var _a;
                    return (url == newUrl &&
                        ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["X-Custom-Header"]) == "456");
                },
            });
            const response = await client.send("/old", { method: "GET" });
            vitest_1.assert.equal(response, "123");
        });
        (0, vitest_1.test)("Should trigger the async before hook", async function () {
            const client = new Client_1.default("test_base_url");
            const newUrl = "test_base_url/new";
            client.beforeSend = function (_, options) {
                options.headers = Object.assign({}, options.headers, {
                    "X-Custom-Header": "456",
                });
                return new Promise((resolve) => {
                    setTimeout(() => resolve({ url: newUrl, options }), 10);
                });
            };
            fetchMock.on({
                method: "GET",
                url: newUrl,
                replyCode: 200,
                replyBody: "123",
                additionalMatcher: function (url, config) {
                    var _a;
                    return (url == newUrl &&
                        ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["X-Custom-Header"]) == "456");
                },
            });
            const response = await client.send("/old", { method: "GET" });
            vitest_1.assert.equal(response, "123");
        });
        (0, vitest_1.test)("Should trigger the after hook", async function () {
            const client = new Client_1.default("test_base_url");
            client.afterSend = function (response, _) {
                if (response.url === "test_base_url/failure") {
                    throw new Error("test_error");
                }
                return "789";
            };
            fetchMock.on({
                method: "GET",
                url: "test_base_url/success",
                replyCode: 200,
                replyBody: "123",
            });
            fetchMock.on({
                method: "GET",
                url: "test_base_url/failure",
                replyCode: 200,
                replyBody: "456",
            });
            // will be replaced with /new
            const responseSuccess = await client.send("/success", { method: "GET" });
            vitest_1.assert.equal(responseSuccess, "789");
            const responseFailure = client.send("/failure", { method: "GET" });
            await (0, vitest_1.expect)(responseFailure).rejects.toThrow();
        });
        (0, vitest_1.test)("Should trigger the async after hook", async function () {
            const client = new Client_1.default("test_base_url");
            client.afterSend = async function () {
                await new Promise((_, reject) => {
                    // use reject to test whether the timeout is awaited
                    setTimeout(() => reject({ data: { message: "after_err" } }), 10);
                });
                return "123";
            };
            fetchMock.on({
                method: "GET",
                url: "test_base_url/async_after",
                replyCode: 200,
                replyBody: "123",
            });
            const response = client.send("/async_after", { method: "GET" });
            await (0, vitest_1.expect)(response).rejects.toThrow("after_err");
        });
    });
    (0, vitest_1.describe)("cancelRequest()", function () {
        (0, vitest_1.test)("Should cancel pending request", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const response = client.send("/123", {
                method: "GET",
                params: { $cancelKey: "testKey" },
            });
            client.cancelRequest("testKey");
            await (0, vitest_1.expect)(response).rejects.toThrow();
        });
    });
    (0, vitest_1.describe)("cancelAllRequests()", function () {
        (0, vitest_1.test)("Should cancel all pending requests", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            fetchMock.on({
                method: "GET",
                url: "test_base_url/456",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", { method: "GET" });
            const requestB = client.send("/456", { method: "GET" });
            client.cancelAllRequests();
            await (0, vitest_1.expect)(requestA).rejects.toThrow();
            await (0, vitest_1.expect)(requestB).rejects.toThrow();
        });
    });
    (0, vitest_1.describe)("auto cancellation", function () {
        (0, vitest_1.test)("Should disable auto cancellation", async function () {
            const client = new Client_1.default("test_base_url");
            client.autoCancellation(false);
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", { method: "GET" });
            const requestB = client.send("/123", { method: "GET" });
            await (0, vitest_1.expect)(requestA).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestB).resolves.toBeDefined();
        });
        (0, vitest_1.test)("Should auto cancel duplicated requests with default key", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", { method: "GET" });
            const requestB = client.send("/123", { method: "GET" });
            const requestC = client.send("/123", { method: "GET" });
            await (0, vitest_1.expect)(requestA).rejects.toThrow();
            await (0, vitest_1.expect)(requestB).rejects.toThrow();
            await (0, vitest_1.expect)(requestC).resolves.toBeDefined();
        });
        (0, vitest_1.test)("(legacy) Should auto cancel duplicated requests with custom key", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", {
                method: "GET",
                params: { $cancelKey: "customKey" },
            });
            const requestB = client.send("/123", { method: "GET" });
            await (0, vitest_1.expect)(requestA).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestB).resolves.toBeDefined();
        });
        (0, vitest_1.test)("Should auto cancel duplicated requests with custom key", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", {
                method: "GET",
                requestKey: "customKey",
            });
            const requestB = client.send("/123", {
                method: "GET",
                requestKey: "customKey",
            });
            const requestC = client.send("/123", { method: "GET" });
            await (0, vitest_1.expect)(requestA).rejects.toThrow();
            await (0, vitest_1.expect)(requestB).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestC).resolves.toBeDefined();
        });
        (0, vitest_1.test)("(legacy) Should skip auto cancellation", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", {
                method: "GET",
                params: { $autoCancel: false },
            });
            const requestB = client.send("/123", {
                method: "GET",
                params: { $autoCancel: false },
            });
            const requestC = client.send("/123", {
                method: "GET",
                params: { $autoCancel: false },
            });
            await (0, vitest_1.expect)(requestA).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestB).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestC).resolves.toBeDefined();
        });
        (0, vitest_1.test)("Should skip auto cancellation", async function () {
            const client = new Client_1.default("test_base_url");
            fetchMock.on({
                method: "GET",
                url: "test_base_url/123",
                delay: 5,
                replyCode: 200,
            });
            const requestA = client.send("/123", { method: "GET", requestKey: null });
            const requestB = client.send("/123", { method: "GET", requestKey: null });
            const requestC = client.send("/123", { method: "GET", requestKey: null });
            await (0, vitest_1.expect)(requestA).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestB).resolves.toBeDefined();
            await (0, vitest_1.expect)(requestC).resolves.toBeDefined();
        });
    });
});
//# sourceMappingURL=Client.spec.js.map
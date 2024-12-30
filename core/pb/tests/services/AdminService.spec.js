"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const suites_1 = require("../suites");
const mocks_1 = require("../mocks");
const Client_1 = require("@/Client");
const AdminService_1 = require("@/services/AdminService");
(0, vitest_1.describe)("AdminService", function () {
    let client;
    let service;
    function initService() {
        client = new Client_1.default("test_base_url");
        service = new AdminService_1.AdminService(client);
    }
    initService();
    // base tests
    (0, suites_1.crudServiceTestsSuite)(service, "/api/admins");
    const fetchMock = new mocks_1.FetchMock();
    (0, vitest_1.beforeEach)(function () {
        initService();
        service.client.authStore.clear(); // reset
    });
    (0, vitest_1.beforeAll)(function () {
        fetchMock.init();
    });
    (0, vitest_1.afterAll)(function () {
        fetchMock.restore();
    });
    (0, vitest_1.afterEach)(function () {
        fetchMock.clearMocks();
    });
    function authResponseCheck(result, expectedToken, expectedAdmin) {
        vitest_1.assert.isNotEmpty(result);
        vitest_1.assert.equal(result.token, expectedToken);
        vitest_1.assert.deepEqual(result.admin, expectedAdmin);
        vitest_1.assert.equal(service.client.authStore.token, expectedToken);
        vitest_1.assert.deepEqual(service.client.authStore.model, expectedAdmin);
    }
    // more tests:
    // ---------------------------------------------------------------
    (0, vitest_1.describe)("AuthStore sync", function () {
        (0, vitest_1.test)("Should update the AuthStore admin model on matching update id", async function () {
            var _a;
            fetchMock.on({
                method: "PATCH",
                url: service.client.buildUrl("/api/admins/test123"),
                replyCode: 200,
                replyBody: {
                    id: "test123",
                    email: "new@example.com",
                },
            });
            service.client.authStore.save("test_token", {
                id: "test123",
                email: "old@example.com",
            });
            await service.update("test123", { email: "new@example.com" });
            vitest_1.assert.equal((_a = service.client.authStore.model) === null || _a === void 0 ? void 0 : _a.email, "new@example.com");
        });
        (0, vitest_1.test)("Should not update the AuthStore admin model on mismatched update id", async function () {
            var _a;
            fetchMock.on({
                method: "PATCH",
                url: service.client.buildUrl("/api/admins/test123"),
                replyCode: 200,
                replyBody: {
                    id: "test123",
                    email: "new@example.com",
                },
            });
            service.client.authStore.save("test_token", {
                id: "test456",
                email: "old@example.com",
            });
            await service.update("test123", { email: "new@example.com" });
            vitest_1.assert.equal((_a = service.client.authStore.model) === null || _a === void 0 ? void 0 : _a.email, "old@example.com");
        });
        (0, vitest_1.test)("Should delete the AuthStore admin model on matching delete id", async function () {
            fetchMock.on({
                method: "DELETE",
                url: service.client.buildUrl("/api/admins/test123"),
                replyCode: 204,
            });
            service.client.authStore.save("test_token", { id: "test123" });
            await service.delete("test123");
            vitest_1.assert.isNull(service.client.authStore.model);
        });
        (0, vitest_1.test)("Should not delete the AuthStore admin model on mismatched delete id", async function () {
            fetchMock.on({
                method: "DELETE",
                url: service.client.buildUrl("/api/admins/test123"),
                replyCode: 204,
            });
            service.client.authStore.save("test_token", { id: "test456" });
            await service.delete("test123");
            vitest_1.assert.isNotNull(service.client.authStore.model);
        });
    });
    (0, vitest_1.describe)("authWithPassword()", function () {
        (0, vitest_1.test)("(legacy) Should auth an admin by its email and password", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password") + "?q1=456",
                body: {
                    identity: "test@example.com",
                    password: "123456",
                    b1: 123,
                },
                replyCode: 200,
                replyBody: {
                    token: "token_authorize",
                    admin: { id: "id_authorize" },
                },
            });
            const result = await service.authWithPassword("test@example.com", "123456", { b1: 123 }, { q1: 456 });
            authResponseCheck(result, "token_authorize", service.decode({ id: "id_authorize" }));
        });
        (0, vitest_1.test)("Should auth an admin by its email and password", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password") + "?q1=456",
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 200,
                replyBody: {
                    token: "token_authorize",
                    admin: { id: "id_authorize" },
                },
            });
            const result = await service.authWithPassword("test@example.com", "123456", {
                q1: 456,
                headers: { "x-test": "123" },
            });
            authResponseCheck(result, "token_authorize", service.decode({ id: "id_authorize" }));
        });
    });
    (0, vitest_1.describe)("authRefresh()", function () {
        (0, vitest_1.test)("(legacy) Should refresh an authorized admin instance", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-refresh") + "?q1=456",
                body: { b1: 123 },
                replyCode: 200,
                replyBody: {
                    token: "token_refresh",
                    admin: { id: "id_refresh" },
                },
            });
            const result = await service.authRefresh({ b1: 123 }, { q1: 456 });
            authResponseCheck(result, "token_refresh", service.decode({ id: "id_refresh" }));
        });
        (0, vitest_1.test)("Should refresh an authorized admin instance", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-refresh") + "?q1=456",
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 200,
                replyBody: {
                    token: "token_refresh",
                    admin: { id: "id_refresh" },
                },
            });
            const result = await service.authRefresh({
                q1: 456,
                headers: { "x-test": "123" },
            });
            authResponseCheck(result, "token_refresh", service.decode({ id: "id_refresh" }));
        });
    });
    (0, vitest_1.describe)("requestPasswordReset()", function () {
        (0, vitest_1.test)("(legacy) Should send a password reset request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/request-password-reset") +
                    "?q1=456",
                body: {
                    email: "test@example.com",
                    b1: 123,
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.requestPasswordReset("test@example.com", { b1: 123 }, { q1: 456 });
            vitest_1.assert.isTrue(result);
        });
        (0, vitest_1.test)("Should send a password reset request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/request-password-reset") +
                    "?q1=456",
                body: {
                    email: "test@example.com",
                },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.requestPasswordReset("test@example.com", {
                q1: 456,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.isTrue(result);
        });
    });
    (0, vitest_1.describe)("confirmPasswordReset()", function () {
        (0, vitest_1.test)("(legacy) Should confirm a password reset request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/confirm-password-reset") +
                    "?q1=456",
                body: {
                    token: "test",
                    password: "123",
                    passwordConfirm: "456",
                    b1: 123,
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.confirmPasswordReset("test", "123", "456", { b1: 123 }, { q1: 456 });
            vitest_1.assert.isTrue(result);
        });
        (0, vitest_1.test)("Should confirm a password reset request", async function () {
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/confirm-password-reset") +
                    "?q1=456",
                body: {
                    token: "test",
                    password: "123",
                    passwordConfirm: "456",
                },
                additionalMatcher: (_, config) => {
                    var _a;
                    return ((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["x-test"]) === "123";
                },
                replyCode: 204,
                replyBody: true,
            });
            const result = await service.confirmPasswordReset("test", "123", "456", {
                q1: 456,
                headers: { "x-test": "123" },
            });
            vitest_1.assert.isTrue(result);
        });
    });
    (0, vitest_1.describe)("auto refresh", function () {
        (0, vitest_1.test)("no threshold - should do nothing in addition if the token has expired", async function () {
            const token = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() - 1 * 60000).getTime() / 1000) << 0,
            });
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                replyCode: 200,
                replyBody: {
                    token: token,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/custom"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], token); // same old token
                    return true;
                },
                replyCode: 204,
                replyBody: null,
            });
            const authResult = await service.authWithPassword("test@example.com", "123456", {
                autoRefreshThreshold: 0,
                query: { a: 1 },
            });
            authResponseCheck(authResult, token, service.decode({ id: "test_id" }));
            await service.client.send("/custom", {});
        });
        (0, vitest_1.test)("new auth - should reset the auto refresh handling", async function () {
            const token = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() - 1 * 60000).getTime() / 1000) << 0,
            });
            const invokes = [];
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: () => {
                    invokes.push("auth-with-password");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: token,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/custom"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], token); // same old token
                    invokes.push("custom");
                    return true;
                },
                replyCode: 204,
                replyBody: null,
            });
            const authResult1 = await service.authWithPassword("test@example.com", "123456", {
                autoRefreshThreshold: 30 * 60,
                query: { a: 1 },
            });
            authResponseCheck(authResult1, token, service.decode({ id: "test_id" }));
            // manually reauthenticate without the auto refresh threshold
            const authResult2 = await service.authWithPassword("test@example.com", "123456", {
                query: { a: 1 },
            });
            authResponseCheck(authResult2, token, service.decode({ id: "test_id" }));
            await service.client.send("/custom", {});
            await service.client.send("/custom", {});
            vitest_1.assert.deepEqual(invokes, [
                "auth-with-password",
                "auth-with-password",
                "custom",
                "custom",
            ]);
        });
        (0, vitest_1.test)("should do nothing if the token is still valid", async function () {
            const token = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() + 31 * 60000).getTime() / 1000) << 0,
            });
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                replyCode: 200,
                replyBody: {
                    token: token,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/custom"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], token);
                    return true;
                },
                replyCode: 204,
                replyBody: null,
            });
            const authResult = await service.authWithPassword("test@example.com", "123456", {
                autoRefreshThreshold: 30 * 60,
                query: { a: 1 },
            });
            await service.client.send("/custom", {});
            authResponseCheck(authResult, token, service.decode({ id: "test_id" }));
        });
        (0, vitest_1.test)("should call authRefresh if the token is going to expire", async function () {
            const token = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() + 29 * 60000).getTime() / 1000) << 0,
            });
            const newToken = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() + 31 * 60000).getTime() / 1000) << 0,
            });
            const invokes = [];
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: () => {
                    invokes.push("auth-with-password");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: token,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-refresh?autoRefresh=true"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], token);
                    invokes.push("auto-auth-refresh");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: newToken,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/custom"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], newToken);
                    invokes.push("custom");
                    return true;
                },
                replyCode: 204,
                replyBody: null,
            });
            const authResult = await service.authWithPassword("test@example.com", "123456", {
                autoRefreshThreshold: 30 * 60,
                query: { a: 1 },
            });
            authResponseCheck(authResult, token, service.decode({ id: "test_id" }));
            await service.client.send("/custom", {});
            await service.client.send("/custom", {});
            vitest_1.assert.equal(service.client.authStore.token, newToken);
            vitest_1.assert.deepEqual(invokes, [
                "auth-with-password",
                "auto-auth-refresh",
                "custom",
                "custom",
            ]);
        });
        (0, vitest_1.test)("should reauthenticate if the token is going to expire and the auto authRefresh fails", async function () {
            const token = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() + 29 * 60000).getTime() / 1000) << 0,
            });
            const newToken = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() + 31 * 60000).getTime() / 1000) << 0,
            });
            const invokes = [];
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: () => {
                    invokes.push("auth-with-password");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: token,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-refresh?autoRefresh=true"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], token);
                    invokes.push("auto-auth-refresh");
                    return true;
                },
                replyCode: 400,
                replyBody: {},
            });
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1&autoRefresh=true"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: () => {
                    invokes.push("auto-auth-with-password");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: newToken,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/custom"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], newToken);
                    invokes.push("custom");
                    return true;
                },
                replyCode: 204,
                replyBody: null,
            });
            const authResult = await service.authWithPassword("test@example.com", "123456", {
                autoRefreshThreshold: 30 * 60,
                query: { a: 1 },
            });
            authResponseCheck(authResult, token, service.decode({ id: "test_id" }));
            await service.client.send("/custom", {});
            await service.client.send("/custom", {});
            vitest_1.assert.equal(service.client.authStore.token, newToken);
            vitest_1.assert.deepEqual(invokes, [
                "auth-with-password",
                "auto-auth-refresh",
                "auto-auth-with-password",
                "custom",
                "custom",
            ]);
        });
        (0, vitest_1.test)("should reauthenticate if the token is expired", async function () {
            const token = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() - 1).getTime() / 1000) << 0,
            });
            const newToken = (0, mocks_1.dummyJWT)({
                id: "test_id",
                type: "admin",
                exp: (new Date(Date.now() + 31 * 60000).getTime() / 1000) << 0,
            });
            const invokes = [];
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: () => {
                    invokes.push("auth-with-password");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: token,
                    admin: { id: "test_id" },
                },
            });
            // shouldn't be invoked!
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-refresh?autoRefresh=true"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], token);
                    invokes.push("auto-auth-refresh");
                    return true;
                },
                replyCode: 400,
                replyBody: {},
            });
            fetchMock.on({
                method: "POST",
                url: service.client.buildUrl("/api/admins/auth-with-password?a=1&autoRefresh=true"),
                body: {
                    identity: "test@example.com",
                    password: "123456",
                },
                additionalMatcher: () => {
                    invokes.push("auto-auth-with-password");
                    return true;
                },
                replyCode: 200,
                replyBody: {
                    token: newToken,
                    admin: { id: "test_id" },
                },
            });
            fetchMock.on({
                method: "GET",
                url: service.client.buildUrl("/custom"),
                additionalMatcher: (_, config) => {
                    var _a;
                    vitest_1.assert.equal((_a = config === null || config === void 0 ? void 0 : config.headers) === null || _a === void 0 ? void 0 : _a["Authorization"], newToken);
                    invokes.push("custom");
                    return true;
                },
                replyCode: 204,
                replyBody: null,
            });
            const authResult = await service.authWithPassword("test@example.com", "123456", {
                autoRefreshThreshold: 30 * 60,
                query: { a: 1 },
            });
            authResponseCheck(authResult, token, service.decode({ id: "test_id" }));
            await service.client.send("/custom", {});
            await service.client.send("/custom", {});
            vitest_1.assert.equal(service.client.authStore.token, newToken);
            vitest_1.assert.deepEqual(invokes, [
                "auth-with-password",
                "auto-auth-with-password",
                "custom",
                "custom",
            ]);
        });
    });
});
//# sourceMappingURL=AdminService.spec.js.map
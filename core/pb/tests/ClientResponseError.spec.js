"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ClientResponseError_1 = require("@/ClientResponseError");
(0, vitest_1.describe)("ClientResponseError", function () {
    (0, vitest_1.describe)("constructor()", function () {
        (0, vitest_1.test)("with object-like value", function () {
            const err = new ClientResponseError_1.ClientResponseError({
                url: "http://example.com",
                status: 400,
                response: { message: "test message" },
                isAbort: true,
                originalError: "test",
            });
            vitest_1.assert.equal(err.url, "http://example.com");
            vitest_1.assert.equal(err.status, 400);
            vitest_1.assert.deepEqual(err.response, { message: "test message" });
            vitest_1.assert.equal(err.isAbort, true);
            vitest_1.assert.equal(err.originalError, "test");
            vitest_1.assert.equal(err.message, "test message");
        });
        (0, vitest_1.test)("with non-object value", function () {
            const err = new ClientResponseError_1.ClientResponseError("test");
            vitest_1.assert.equal(err.url, "");
            vitest_1.assert.equal(err.status, 0);
            vitest_1.assert.deepEqual(err.response, {});
            vitest_1.assert.equal(err.isAbort, false);
            vitest_1.assert.equal(err.originalError, "test");
            vitest_1.assert.equal(err.message, "Something went wrong while processing your request.");
        });
        (0, vitest_1.test)("with plain error", function () {
            const plainErr = new Error("test");
            const err = new ClientResponseError_1.ClientResponseError(plainErr);
            vitest_1.assert.equal(err.url, "");
            vitest_1.assert.equal(err.status, 0);
            vitest_1.assert.deepEqual(err.response, {});
            vitest_1.assert.equal(err.isAbort, false);
            vitest_1.assert.equal(err.originalError, plainErr);
            vitest_1.assert.equal(err.message, "Something went wrong while processing your request.");
        });
        (0, vitest_1.test)("with ClientResponseError error", function () {
            const err0 = new ClientResponseError_1.ClientResponseError({
                url: "http://example.com",
                status: 400,
                response: { message: "test message" },
                isAbort: true,
                originalError: "test",
            });
            const err = new ClientResponseError_1.ClientResponseError(err0);
            vitest_1.assert.equal(err.url, "http://example.com");
            vitest_1.assert.equal(err.status, 400);
            vitest_1.assert.deepEqual(err.response, { message: "test message" });
            vitest_1.assert.equal(err.isAbort, true);
            vitest_1.assert.equal(err.originalError, "test");
            vitest_1.assert.equal(err.message, "test message");
        });
        (0, vitest_1.test)("with abort error", function () {
            const err0 = new DOMException("test");
            const err = new ClientResponseError_1.ClientResponseError(err0);
            vitest_1.assert.equal(err.url, "");
            vitest_1.assert.equal(err.status, 0);
            vitest_1.assert.deepEqual(err.response, {});
            vitest_1.assert.equal(err.isAbort, true);
            vitest_1.assert.equal(err.originalError, err0);
            vitest_1.assert.include(err.message, "request was autocancelled");
        });
    });
});
//# sourceMappingURL=ClientResponseError.spec.js.map
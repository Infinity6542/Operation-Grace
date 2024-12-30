"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const cookie_1 = require("@/stores/utils/cookie");
(0, vitest_1.describe)("cookie", function () {
    (0, vitest_1.describe)("cookieParse()", function () {
        (0, vitest_1.test)("Should return an empty object if no cookie string", function () {
            const cookies = (0, cookie_1.cookieParse)("");
            vitest_1.assert.deepEqual(cookies, {});
        });
        (0, vitest_1.test)("Should successfully parse a valid cookie string", function () {
            const cookies = (0, cookie_1.cookieParse)("foo=bar; abc=12@3");
            vitest_1.assert.deepEqual(cookies, { foo: "bar", abc: "12@3" });
        });
    });
    (0, vitest_1.describe)("cookieSerialize()", function () {
        (0, vitest_1.test)("Should serialize an empty value", function () {
            const result = (0, cookie_1.cookieSerialize)("test_cookie", "");
            vitest_1.assert.equal(result, "test_cookie=");
        });
        (0, vitest_1.test)("Should serialize a non empty value", function () {
            const result = (0, cookie_1.cookieSerialize)("test_cookie", "abc");
            vitest_1.assert.equal(result, "test_cookie=abc");
        });
        (0, vitest_1.test)("Should generate a cookie with all available options", function () {
            const result = (0, cookie_1.cookieSerialize)("test_cookie", "abc", {
                maxAge: 123,
                domain: "test.com",
                path: "/abc/",
                expires: new Date("2022-01-01"),
                httpOnly: true,
                secure: true,
                priority: "low",
                sameSite: "lax",
                encode: (val) => "encode_" + encodeURIComponent(val),
            });
            vitest_1.assert.equal(result, "test_cookie=encode_abc; Max-Age=123; Domain=test.com; Path=/abc/; Expires=Sat, 01 Jan 2022 00:00:00 GMT; HttpOnly; Secure; Priority=Low; SameSite=Lax");
        });
    });
});
//# sourceMappingURL=cookie.spec.js.map
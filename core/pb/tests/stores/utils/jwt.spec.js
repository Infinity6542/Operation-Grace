"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jwt_1 = require("@/stores/utils/jwt");
(0, vitest_1.describe)("jwt", function () {
    (0, vitest_1.describe)("getTokenPayload()", function () {
        (0, vitest_1.test)("Should extract JWT payload without validation", function () {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoxMjN9.da77dJt5jjPU43vaaCr6WeHEXrxzB37b0edfjwyD-2M";
            const payload = (0, jwt_1.getTokenPayload)(token);
            vitest_1.assert.deepEqual(payload, { test: 123 });
        });
        (0, vitest_1.test)("Should fallback to empty object on invalid JWT string", function () {
            const testCases = ["", "abc", "a.b.c"];
            for (let i in testCases) {
                const test = testCases[i];
                const payload = (0, jwt_1.getTokenPayload)(test);
                vitest_1.assert.deepEqual(payload, {}, "scenario " + i);
            }
        });
    });
    (0, vitest_1.describe)("isTokenExpired()", function () {
        (0, vitest_1.test)("Should successfully verify that a JWT token is expired or not", function () {
            const testCases = [
                // invalid JWT string
                [true, ""],
                // token with empty payload is also considered invalid JWT string
                [
                    true,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U",
                ],
                // token without exp param
                [
                    false,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoxMjN9.da77dJt5jjPU43vaaCr6WeHEXrxzB37b0edfjwyD-2M",
                ],
                // token with exp param in the past
                [
                    true,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoxMjMsImV4cCI6MTYyNDc4ODAwMH0.WOzXh8TQh6fBXJJlOvHktBuv7D8eSyrYx4_IBj2Deyo",
                ],
                // token with exp param in the future
                [
                    false,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoxMjMsImV4cCI6MTkwODc4NDgwMH0.vVbRVx-Bs7pusxfU8TTTOEtNcUEYSzmJUboC68PB5iE",
                ],
            ];
            for (let i in testCases) {
                const test = testCases[i];
                vitest_1.assert.equal((0, jwt_1.isTokenExpired)(test[1]), test[0], "scenario " + i);
            }
        });
    });
});
//# sourceMappingURL=jwt.spec.js.map
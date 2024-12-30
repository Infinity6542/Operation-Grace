"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMock = void 0;
exports.dummyJWT = dummyJWT;
const ClientResponseError_1 = require("@/ClientResponseError");
function dummyJWT(payload = {}) {
    const buf = Buffer.from(JSON.stringify(payload));
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + buf.toString("base64") + ".test";
}
class FetchMock {
    constructor() {
        this.mocks = [];
    }
    on(request) {
        this.mocks.push(request);
    }
    /**
     * Initializes the mock by temporary overwriting `global.fetch`.
     */
    init() {
        this.originalFetch = global === null || global === void 0 ? void 0 : global.fetch;
        global.fetch = (url, config) => {
            for (let mock of this.mocks) {
                // match url and method
                if (mock.url !== url || (config === null || config === void 0 ? void 0 : config.method) !== mock.method) {
                    continue;
                }
                // match body params
                if (mock.body) {
                    let configBody = {};
                    // deserialize
                    if (typeof (config === null || config === void 0 ? void 0 : config.body) === "string") {
                        configBody = JSON.parse(config === null || config === void 0 ? void 0 : config.body);
                    }
                    let hasMissingBodyParam = false;
                    for (const key in mock.body) {
                        if (typeof configBody[key] === "undefined" ||
                            JSON.stringify(configBody[key]) !=
                                JSON.stringify(mock.body[key])) {
                            hasMissingBodyParam = true;
                            break;
                        }
                    }
                    if (hasMissingBodyParam) {
                        continue;
                    }
                }
                if (mock.additionalMatcher && !mock.additionalMatcher(url, config)) {
                    continue;
                }
                const response = {
                    url: url,
                    status: mock.replyCode,
                    statusText: "test",
                    json: async () => mock.replyBody || {},
                };
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        var _a;
                        if (!!((_a = config === null || config === void 0 ? void 0 : config.signal) === null || _a === void 0 ? void 0 : _a.aborted)) {
                            reject(new ClientResponseError_1.ClientResponseError());
                        }
                        resolve(response);
                    }, mock.delay || 0);
                });
            }
            throw new Error("Request not mocked: " + url);
        };
    }
    /**
     * Restore the original node fetch function.
     */
    restore() {
        global.fetch = this.originalFetch;
    }
    /**
     * Clears all registered mocks.
     */
    clearMocks() {
        this.mocks = [];
    }
}
exports.FetchMock = FetchMock;
//# sourceMappingURL=mocks.js.map
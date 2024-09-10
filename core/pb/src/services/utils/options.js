"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUnknownQueryParams = normalizeUnknownQueryParams;
// -------------------------------------------------------------------
// list of known SendOptions keys (everything else is treated as query param)
const knownSendOptionsKeys = [
    "requestKey",
    "$cancelKey",
    "$autoCancel",
    "fetch",
    "headers",
    "body",
    "query",
    "params",
    // ---,
    "cache",
    "credentials",
    "headers",
    "integrity",
    "keepalive",
    "method",
    "mode",
    "redirect",
    "referrer",
    "referrerPolicy",
    "signal",
    "window",
];
// modifies in place the provided options by moving unknown send options as query parameters.
function normalizeUnknownQueryParams(options) {
    if (!options) {
        return;
    }
    options.query = options.query || {};
    for (let key in options) {
        if (knownSendOptionsKeys.includes(key)) {
            continue;
        }
        options.query[key] = options[key];
        delete options[key];
    }
}
//# sourceMappingURL=options.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLegacyOptionsArgs = normalizeLegacyOptionsArgs;
function normalizeLegacyOptionsArgs(legacyWarn, baseOptions, bodyOrOptions, query) {
    const hasBodyOrOptions = typeof bodyOrOptions !== "undefined";
    const hasQuery = typeof query !== "undefined";
    if (!hasQuery && !hasBodyOrOptions) {
        return baseOptions;
    }
    if (hasQuery) {
        console.warn(legacyWarn);
        baseOptions.body = Object.assign({}, baseOptions.body, bodyOrOptions);
        baseOptions.query = Object.assign({}, baseOptions.query, query);
        return baseOptions;
    }
    return Object.assign(baseOptions, bodyOrOptions);
}
//# sourceMappingURL=legacy.js.map
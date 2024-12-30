"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAutoRefresh = resetAutoRefresh;
exports.registerAutoRefresh = registerAutoRefresh;
const jwt_1 = require("@/stores/utils/jwt");
// reset previous auto refresh registrations
function resetAutoRefresh(client) {
    var _a, _b;
    (_b = (_a = client)._resetAutoRefresh) === null || _b === void 0 ? void 0 : _b.call(_a);
}
function registerAutoRefresh(client, threshold, refreshFunc, reauthenticateFunc) {
    resetAutoRefresh(client);
    const oldBeforeSend = client.beforeSend;
    const oldModel = client.authStore.model;
    // unset the auto refresh in case the auth store was cleared
    // OR a new model was authenticated
    const unsubStoreChange = client.authStore.onChange((newToken, model) => {
        if (!newToken ||
            (model === null || model === void 0 ? void 0 : model.id) != (oldModel === null || oldModel === void 0 ? void 0 : oldModel.id) ||
            // check the collection id in case an admin and auth record share the same id
            (((model === null || model === void 0 ? void 0 : model.collectionId) || (oldModel === null || oldModel === void 0 ? void 0 : oldModel.collectionId)) &&
                (model === null || model === void 0 ? void 0 : model.collectionId) != (oldModel === null || oldModel === void 0 ? void 0 : oldModel.collectionId))) {
            resetAutoRefresh(client);
        }
    });
    // initialize a reset function and attach it dynamically to the client
    client._resetAutoRefresh = function () {
        unsubStoreChange();
        client.beforeSend = oldBeforeSend;
        delete client._resetAutoRefresh;
    };
    client.beforeSend = async (url, sendOptions) => {
        var _a;
        const oldToken = client.authStore.token;
        if ((_a = sendOptions.query) === null || _a === void 0 ? void 0 : _a.autoRefresh) {
            return oldBeforeSend ? oldBeforeSend(url, sendOptions) : { url, sendOptions };
        }
        let isValid = client.authStore.isValid;
        if (
        // is loosely valid
        isValid &&
            // but it is going to expire in the next "threshold" seconds
            (0, jwt_1.isTokenExpired)(client.authStore.token, threshold)) {
            try {
                await refreshFunc();
            }
            catch (_) {
                isValid = false;
            }
        }
        // still invalid -> reauthenticate
        if (!isValid) {
            await reauthenticateFunc();
        }
        // the request wasn't sent with a custom token
        const headers = sendOptions.headers || {};
        for (let key in headers) {
            if (key.toLowerCase() == "authorization" &&
                // the request wasn't sent with a custom token
                oldToken == headers[key] &&
                client.authStore.token) {
                // set the latest store token
                headers[key] = client.authStore.token;
                break;
            }
        }
        sendOptions.headers = headers;
        return oldBeforeSend ? oldBeforeSend(url, sendOptions) : { url, sendOptions };
    };
}
//# sourceMappingURL=refresh.js.map
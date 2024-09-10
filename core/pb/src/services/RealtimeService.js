"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = void 0;
const ClientResponseError_1 = require("@/ClientResponseError");
const BaseService_1 = require("@/services/utils/BaseService");
const options_1 = require("@/services/utils/options");
class RealtimeService extends BaseService_1.BaseService {
    constructor() {
        super(...arguments);
        this.clientId = "";
        this.eventSource = null;
        this.subscriptions = {};
        this.lastSentSubscriptions = [];
        this.maxConnectTimeout = 15000;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = Infinity;
        this.predefinedReconnectIntervals = [
            200, 300, 500, 1000, 1200, 1500, 2000,
        ];
        this.pendingConnects = [];
    }
    /**
     * Returns whether the realtime connection has been established.
     */
    get isConnected() {
        return !!this.eventSource && !!this.clientId && !this.pendingConnects.length;
    }
    /**
     * Register the subscription listener.
     *
     * You can subscribe multiple times to the same topic.
     *
     * If the SSE connection is not started yet,
     * this method will also initialize it.
     */
    async subscribe(topic, callback, options) {
        var _a;
        if (!topic) {
            throw new Error("topic must be set.");
        }
        let key = topic;
        // serialize and append the topic options (if any)
        if (options) {
            (0, options_1.normalizeUnknownQueryParams)(options);
            const serialized = "options=" +
                encodeURIComponent(JSON.stringify({ query: options.query, headers: options.headers }));
            key += (key.includes("?") ? "&" : "?") + serialized;
        }
        const listener = function (e) {
            const msgEvent = e;
            let data;
            try {
                data = JSON.parse(msgEvent === null || msgEvent === void 0 ? void 0 : msgEvent.data);
            }
            catch (_a) { }
            callback(data || {});
        };
        // store the listener
        if (!this.subscriptions[key]) {
            this.subscriptions[key] = [];
        }
        this.subscriptions[key].push(listener);
        if (!this.isConnected) {
            // initialize sse connection
            await this.connect();
        }
        else if (this.subscriptions[key].length === 1) {
            // send the updated subscriptions (if it is the first for the key)
            await this.submitSubscriptions();
        }
        else {
            // only register the listener
            (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.addEventListener(key, listener);
        }
        return async () => {
            return this.unsubscribeByTopicAndListener(topic, listener);
        };
    }
    /**
     * Unsubscribe from all subscription listeners with the specified topic.
     *
     * If `topic` is not provided, then this method will unsubscribe
     * from all active subscriptions.
     *
     * This method is no-op if there are no active subscriptions.
     *
     * The related sse connection will be autoclosed if after the
     * unsubscribe operation there are no active subscriptions left.
     */
    async unsubscribe(topic) {
        var _a;
        let needToSubmit = false;
        if (!topic) {
            // remove all subscriptions
            this.subscriptions = {};
        }
        else {
            // remove all listeners related to the topic
            const subs = this.getSubscriptionsByTopic(topic);
            for (let key in subs) {
                if (!this.hasSubscriptionListeners(key)) {
                    continue; // already unsubscribed
                }
                for (let listener of this.subscriptions[key]) {
                    (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.removeEventListener(key, listener);
                }
                delete this.subscriptions[key];
                // mark for subscriptions change submit if there are no other listeners
                if (!needToSubmit) {
                    needToSubmit = true;
                }
            }
        }
        if (!this.hasSubscriptionListeners()) {
            // no other active subscriptions -> close the sse connection
            this.disconnect();
        }
        else if (needToSubmit) {
            await this.submitSubscriptions();
        }
    }
    /**
     * Unsubscribe from all subscription listeners starting with the specified topic prefix.
     *
     * This method is no-op if there are no active subscriptions with the specified topic prefix.
     *
     * The related sse connection will be autoclosed if after the
     * unsubscribe operation there are no active subscriptions left.
     */
    async unsubscribeByPrefix(keyPrefix) {
        var _a;
        let hasAtleastOneTopic = false;
        for (let key in this.subscriptions) {
            // "?" so that it can be used as end delimiter for the prefix
            if (!(key + "?").startsWith(keyPrefix)) {
                continue;
            }
            hasAtleastOneTopic = true;
            for (let listener of this.subscriptions[key]) {
                (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.removeEventListener(key, listener);
            }
            delete this.subscriptions[key];
        }
        if (!hasAtleastOneTopic) {
            return; // nothing to unsubscribe from
        }
        if (this.hasSubscriptionListeners()) {
            // submit the deleted subscriptions
            await this.submitSubscriptions();
        }
        else {
            // no other active subscriptions -> close the sse connection
            this.disconnect();
        }
    }
    /**
     * Unsubscribe from all subscriptions matching the specified topic and listener function.
     *
     * This method is no-op if there are no active subscription with
     * the specified topic and listener.
     *
     * The related sse connection will be autoclosed if after the
     * unsubscribe operation there are no active subscriptions left.
     */
    async unsubscribeByTopicAndListener(topic, listener) {
        var _a;
        let needToSubmit = false;
        const subs = this.getSubscriptionsByTopic(topic);
        for (let key in subs) {
            if (!Array.isArray(this.subscriptions[key]) ||
                !this.subscriptions[key].length) {
                continue; // already unsubscribed
            }
            let exist = false;
            for (let i = this.subscriptions[key].length - 1; i >= 0; i--) {
                if (this.subscriptions[key][i] !== listener) {
                    continue;
                }
                exist = true; // has at least one matching listener
                delete this.subscriptions[key][i]; // removes the function reference
                this.subscriptions[key].splice(i, 1); // reindex the array
                (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.removeEventListener(key, listener);
            }
            if (!exist) {
                continue;
            }
            // remove the key from the subscriptions list if there are no other listeners
            if (!this.subscriptions[key].length) {
                delete this.subscriptions[key];
            }
            // mark for subscriptions change submit if there are no other listeners
            if (!needToSubmit && !this.hasSubscriptionListeners(key)) {
                needToSubmit = true;
            }
        }
        if (!this.hasSubscriptionListeners()) {
            // no other active subscriptions -> close the sse connection
            this.disconnect();
        }
        else if (needToSubmit) {
            await this.submitSubscriptions();
        }
    }
    hasSubscriptionListeners(keyToCheck) {
        var _a, _b;
        this.subscriptions = this.subscriptions || {};
        // check the specified key
        if (keyToCheck) {
            return !!((_a = this.subscriptions[keyToCheck]) === null || _a === void 0 ? void 0 : _a.length);
        }
        // check for at least one non-empty subscription
        for (let key in this.subscriptions) {
            if (!!((_b = this.subscriptions[key]) === null || _b === void 0 ? void 0 : _b.length)) {
                return true;
            }
        }
        return false;
    }
    async submitSubscriptions() {
        if (!this.clientId) {
            return; // no client/subscriber
        }
        // optimistic update
        this.addAllSubscriptionListeners();
        this.lastSentSubscriptions = this.getNonEmptySubscriptionKeys();
        return this.client
            .send("/api/realtime", {
            method: "POST",
            body: {
                clientId: this.clientId,
                subscriptions: this.lastSentSubscriptions,
            },
            requestKey: this.getSubscriptionsCancelKey(),
        })
            .catch((err) => {
            if (err === null || err === void 0 ? void 0 : err.isAbort) {
                return; // silently ignore aborted pending requests
            }
            throw err;
        });
    }
    getSubscriptionsCancelKey() {
        return "realtime_" + this.clientId;
    }
    getSubscriptionsByTopic(topic) {
        const result = {};
        // "?" so that it can be used as end delimiter for the topic
        topic = topic.includes("?") ? topic : topic + "?";
        for (let key in this.subscriptions) {
            if ((key + "?").startsWith(topic)) {
                result[key] = this.subscriptions[key];
            }
        }
        return result;
    }
    getNonEmptySubscriptionKeys() {
        const result = [];
        for (let key in this.subscriptions) {
            if (this.subscriptions[key].length) {
                result.push(key);
            }
        }
        return result;
    }
    addAllSubscriptionListeners() {
        if (!this.eventSource) {
            return;
        }
        this.removeAllSubscriptionListeners();
        for (let key in this.subscriptions) {
            for (let listener of this.subscriptions[key]) {
                this.eventSource.addEventListener(key, listener);
            }
        }
    }
    removeAllSubscriptionListeners() {
        if (!this.eventSource) {
            return;
        }
        for (let key in this.subscriptions) {
            for (let listener of this.subscriptions[key]) {
                this.eventSource.removeEventListener(key, listener);
            }
        }
    }
    async connect() {
        if (this.reconnectAttempts > 0) {
            // immediately resolve the promise to avoid indefinitely
            // blocking the client during reconnection
            return;
        }
        return new Promise((resolve, reject) => {
            this.pendingConnects.push({ resolve, reject });
            if (this.pendingConnects.length > 1) {
                // all promises will be resolved once the connection is established
                return;
            }
            this.initConnect();
        });
    }
    initConnect() {
        this.disconnect(true);
        // wait up to 15s for connect
        clearTimeout(this.connectTimeoutId);
        this.connectTimeoutId = setTimeout(() => {
            this.connectErrorHandler(new Error("EventSource connect took too long."));
        }, this.maxConnectTimeout);
        this.eventSource = new EventSource(this.client.buildUrl("/api/realtime"));
        this.eventSource.onerror = (_) => {
            this.connectErrorHandler(new Error("Failed to establish realtime connection."));
        };
        this.eventSource.addEventListener("PB_CONNECT", (e) => {
            const msgEvent = e;
            this.clientId = msgEvent === null || msgEvent === void 0 ? void 0 : msgEvent.lastEventId;
            this.submitSubscriptions()
                .then(async () => {
                let retries = 3;
                while (this.hasUnsentSubscriptions() && retries > 0) {
                    retries--;
                    // resubscribe to ensure that the latest topics are submitted
                    //
                    // This is needed because missed topics could happen on reconnect
                    // if after the pending sent `submitSubscriptions()` call another `subscribe()`
                    // was made before the submit was able to complete.
                    await this.submitSubscriptions();
                }
            })
                .then(() => {
                for (let p of this.pendingConnects) {
                    p.resolve();
                }
                // reset connect meta
                this.pendingConnects = [];
                this.reconnectAttempts = 0;
                clearTimeout(this.reconnectTimeoutId);
                clearTimeout(this.connectTimeoutId);
                // propagate the PB_CONNECT event
                const connectSubs = this.getSubscriptionsByTopic("PB_CONNECT");
                for (let key in connectSubs) {
                    for (let listener of connectSubs[key]) {
                        listener(e);
                    }
                }
            })
                .catch((err) => {
                this.clientId = "";
                this.connectErrorHandler(err);
            });
        });
    }
    hasUnsentSubscriptions() {
        const latestTopics = this.getNonEmptySubscriptionKeys();
        if (latestTopics.length != this.lastSentSubscriptions.length) {
            return true;
        }
        for (const t of latestTopics) {
            if (!this.lastSentSubscriptions.includes(t)) {
                return true;
            }
        }
        return false;
    }
    connectErrorHandler(err) {
        clearTimeout(this.connectTimeoutId);
        clearTimeout(this.reconnectTimeoutId);
        if (
        // wasn't previously connected -> direct reject
        (!this.clientId && !this.reconnectAttempts) ||
            // was previously connected but the max reconnection limit has been reached
            this.reconnectAttempts > this.maxReconnectAttempts) {
            for (let p of this.pendingConnects) {
                p.reject(new ClientResponseError_1.ClientResponseError(err));
            }
            this.pendingConnects = [];
            this.disconnect();
            return;
        }
        // otherwise -> reconnect in the background
        this.disconnect(true);
        const timeout = this.predefinedReconnectIntervals[this.reconnectAttempts] ||
            this.predefinedReconnectIntervals[this.predefinedReconnectIntervals.length - 1];
        this.reconnectAttempts++;
        this.reconnectTimeoutId = setTimeout(() => {
            this.initConnect();
        }, timeout);
    }
    disconnect(fromReconnect = false) {
        var _a;
        clearTimeout(this.connectTimeoutId);
        clearTimeout(this.reconnectTimeoutId);
        this.removeAllSubscriptionListeners();
        this.client.cancelRequest(this.getSubscriptionsCancelKey());
        (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.close();
        this.eventSource = null;
        this.clientId = "";
        if (!fromReconnect) {
            this.reconnectAttempts = 0;
            // resolve any remaining connect promises
            //
            // this is done to avoid unnecessary throwing errors in case
            // unsubscribe is called before the pending connect promises complete
            // (see https://github.com/pocketbase/pocketbase/discussions/2897#discussioncomment-6423818)
            for (let p of this.pendingConnects) {
                p.resolve();
            }
            this.pendingConnects = [];
        }
    }
}
exports.RealtimeService = RealtimeService;
//# sourceMappingURL=RealtimeService.js.map
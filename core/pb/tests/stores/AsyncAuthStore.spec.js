"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const AsyncAuthStore_1 = require("@/stores/AsyncAuthStore");
(0, vitest_1.describe)("AsyncAuthStore", function () {
    (0, vitest_1.describe)("construct()", function () {
        (0, vitest_1.test)("load empty initial", async function () {
            let calls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    calls.push(payload);
                },
            });
            vitest_1.assert.equal(store.token, "");
            vitest_1.assert.equal(store.model, null);
            const callsPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(calls), 0);
            });
            await (0, vitest_1.expect)(callsPromise).resolves.toStrictEqual([]);
        });
        (0, vitest_1.test)("load initial from string", async function () {
            let calls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    calls.push(payload);
                },
                initial: `{"token": "test", "model": {"id": "id1"}}`,
            });
            const callsPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(calls), 0);
            });
            await (0, vitest_1.expect)(callsPromise).resolves.toStrictEqual([
                `{"token":"test","model":{"id":"id1"}}`,
            ]);
            vitest_1.assert.equal(store.token, "test");
            vitest_1.assert.deepEqual(store.model, { id: "id1" });
        });
        (0, vitest_1.test)("load initial from Promise<string>", async function () {
            let calls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    calls.push(payload);
                },
                initial: Promise.resolve(`{"token": "test", "model": {"id": "id1"}}`),
            });
            const callsPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(calls), 0);
            });
            await (0, vitest_1.expect)(callsPromise).resolves.toStrictEqual([
                `{"token":"test","model":{"id":"id1"}}`,
            ]);
            vitest_1.assert.equal(store.token, "test");
            vitest_1.assert.deepEqual(store.model, { id: "id1" });
        });
        (0, vitest_1.test)("load initial from Promise<object>", async function () {
            let calls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    calls.push(payload);
                },
                initial: Promise.resolve({ token: "test", model: { id: "id1" } }),
            });
            const callsPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(calls), 0);
            });
            await (0, vitest_1.expect)(callsPromise).resolves.toStrictEqual([
                `{"token":"test","model":{"id":"id1"}}`,
            ]);
            vitest_1.assert.equal(store.token, "test");
            vitest_1.assert.deepEqual(store.model, { id: "id1" });
        });
    });
    (0, vitest_1.describe)("save()", function () {
        (0, vitest_1.test)("trigger saveFunc", async function () {
            let calls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    calls.push(payload);
                },
            });
            store.save("test1", { id: "id1" });
            vitest_1.assert.equal(store.token, "test1");
            vitest_1.assert.deepEqual(store.model, { id: "id1" });
            // update
            store.save("test2", { id: "id2" });
            vitest_1.assert.equal(store.token, "test2");
            vitest_1.assert.deepEqual(store.model, { id: "id2" });
            const callsPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(calls), 0);
            });
            await (0, vitest_1.expect)(callsPromise).resolves.toStrictEqual([
                `{"token":"test1","model":{"id":"id1"}}`,
                `{"token":"test2","model":{"id":"id2"}}`,
            ]);
        });
    });
    (0, vitest_1.describe)("clear()", function () {
        (0, vitest_1.test)("no explicit clearFunc", async function () {
            let calls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    calls.push(payload);
                },
            });
            store.save("test", { id: "id1" });
            vitest_1.assert.equal(store.token, "test");
            vitest_1.assert.deepEqual(store.model, { id: "id1" });
            store.clear();
            vitest_1.assert.equal(store.token, "");
            vitest_1.assert.deepEqual(store.model, null);
            const callsPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(calls), 0);
            });
            await (0, vitest_1.expect)(callsPromise).resolves.toStrictEqual([
                `{"token":"test","model":{"id":"id1"}}`,
                "",
            ]);
        });
        (0, vitest_1.test)("with explicit clearFunc", async function () {
            let saveCalls = [];
            let clearCalls = [];
            const store = new AsyncAuthStore_1.AsyncAuthStore({
                save: async (payload) => {
                    saveCalls.push(payload);
                },
                clear: async () => {
                    clearCalls.push("clear_test");
                },
            });
            store.save("test", { id: "id1" });
            vitest_1.assert.equal(store.token, "test");
            vitest_1.assert.deepEqual(store.model, { id: "id1" });
            store.clear();
            vitest_1.assert.equal(store.token, "");
            vitest_1.assert.deepEqual(store.model, null);
            const savePromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(saveCalls), 0);
            });
            await (0, vitest_1.expect)(savePromise).resolves.toStrictEqual([
                `{"token":"test","model":{"id":"id1"}}`,
            ]);
            const clearPromise = new Promise((resolve, _) => {
                setTimeout(() => resolve(clearCalls), 0);
            });
            await (0, vitest_1.expect)(clearPromise).resolves.toStrictEqual(["clear_test"]);
        });
    });
});
//# sourceMappingURL=AsyncAuthStore.spec.js.map
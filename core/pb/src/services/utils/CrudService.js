"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
const BaseService_1 = require("@/services/utils/BaseService");
const ClientResponseError_1 = require("@/ClientResponseError");
class CrudService extends BaseService_1.BaseService {
    /**
     * Response data decoder.
     */
    decode(data) {
        return data;
    }
    async getFullList(batchOrqueryParams, options) {
        if (typeof batchOrqueryParams == "number") {
            return this._getFullList(batchOrqueryParams, options);
        }
        options = Object.assign({}, batchOrqueryParams, options);
        let batch = 500;
        if (options.batch) {
            batch = options.batch;
            delete options.batch;
        }
        return this._getFullList(batch, options);
    }
    /**
     * Returns paginated items list.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    async getList(page = 1, perPage = 30, options) {
        options = Object.assign({
            method: "GET",
        }, options);
        options.query = Object.assign({
            page: page,
            perPage: perPage,
        }, options.query);
        return this.client.send(this.baseCrudPath, options).then((responseData) => {
            var _a;
            responseData.items =
                ((_a = responseData.items) === null || _a === void 0 ? void 0 : _a.map((item) => {
                    return this.decode(item);
                })) || [];
            return responseData;
        });
    }
    /**
     * Returns the first found item by the specified filter.
     *
     * Internally it calls `getList(1, 1, { filter, skipTotal })` and
     * returns the first found item.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * For consistency with `getOne`, this method will throw a 404
     * ClientResponseError if no item was found.
     *
     * @throws {ClientResponseError}
     */
    async getFirstListItem(filter, options) {
        options = Object.assign({
            requestKey: "one_by_filter_" + this.baseCrudPath + "_" + filter,
        }, options);
        options.query = Object.assign({
            filter: filter,
            skipTotal: 1,
        }, options.query);
        return this.getList(1, 1, options).then((result) => {
            var _a;
            if (!((_a = result === null || result === void 0 ? void 0 : result.items) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new ClientResponseError_1.ClientResponseError({
                    status: 404,
                    response: {
                        code: 404,
                        message: "The requested resource wasn't found.",
                        data: {},
                    },
                });
            }
            return result.items[0];
        });
    }
    /**
     * Returns single item by its id.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * If `id` is empty it will throw a 404 error.
     *
     * @throws {ClientResponseError}
     */
    async getOne(id, options) {
        if (!id) {
            throw new ClientResponseError_1.ClientResponseError({
                url: this.client.buildUrl(this.baseCrudPath + "/"),
                status: 404,
                response: {
                    code: 404,
                    message: "Missing required record id.",
                    data: {},
                },
            });
        }
        options = Object.assign({
            method: "GET",
        }, options);
        return this.client
            .send(this.baseCrudPath + "/" + encodeURIComponent(id), options)
            .then((responseData) => this.decode(responseData));
    }
    /**
     * Creates a new item.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    async create(bodyParams, options) {
        options = Object.assign({
            method: "POST",
            body: bodyParams,
        }, options);
        return this.client
            .send(this.baseCrudPath, options)
            .then((responseData) => this.decode(responseData));
    }
    /**
     * Updates an existing item by its id.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    async update(id, bodyParams, options) {
        options = Object.assign({
            method: "PATCH",
            body: bodyParams,
        }, options);
        return this.client
            .send(this.baseCrudPath + "/" + encodeURIComponent(id), options)
            .then((responseData) => this.decode(responseData));
    }
    /**
     * Deletes an existing item by its id.
     *
     * @throws {ClientResponseError}
     */
    async delete(id, options) {
        options = Object.assign({
            method: "DELETE",
        }, options);
        return this.client
            .send(this.baseCrudPath + "/" + encodeURIComponent(id), options)
            .then(() => true);
    }
    /**
     * Returns a promise with all list items batch fetched at once.
     */
    _getFullList(batchSize = 500, options) {
        options = options || {};
        options.query = Object.assign({
            skipTotal: 1,
        }, options.query);
        let result = [];
        let request = async (page) => {
            return this.getList(page, batchSize || 500, options).then((list) => {
                const castedList = list;
                const items = castedList.items;
                result = result.concat(items);
                if (items.length == list.perPage) {
                    return request(page + 1);
                }
                return result;
            });
        };
        return request(1);
    }
}
exports.CrudService = CrudService;
//# sourceMappingURL=CrudService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionService = void 0;
const CrudService_1 = require("@/services/utils/CrudService");
class CollectionService extends CrudService_1.CrudService {
    /**
     * @inheritdoc
     */
    get baseCrudPath() {
        return "/api/collections";
    }
    /**
     * Imports the provided collections.
     *
     * If `deleteMissing` is `true`, all local collections and schema fields,
     * that are not present in the imported configuration, WILL BE DELETED
     * (including their related records data)!
     *
     * @throws {ClientResponseError}
     */
    async import(collections, deleteMissing = false, options) {
        options = Object.assign({
            method: "PUT",
            body: {
                collections: collections,
                deleteMissing: deleteMissing,
            },
        }, options);
        return this.client.send(this.baseCrudPath + "/import", options).then(() => true);
    }
}
exports.CollectionService = CollectionService;
//# sourceMappingURL=CollectionService.js.map
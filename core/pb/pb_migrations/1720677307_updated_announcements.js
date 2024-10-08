/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("om17565ipy22cng")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vdi9x1pw",
    "name": "validUntil",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("om17565ipy22cng")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vdi9x1pw",
    "name": "validUntil",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})

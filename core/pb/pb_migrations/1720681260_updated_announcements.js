/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("om17565ipy22cng")

  // remove
  collection.schema.removeField("sfv18dc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tdtd5kzr",
    "name": "id_no",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tdkytxur",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "general",
        "important",
        "critical",
        "update"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("om17565ipy22cng")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sfv18dc0",
    "name": "type",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("tdtd5kzr")

  // remove
  collection.schema.removeField("tdkytxur")

  return dao.saveCollection(collection)
})

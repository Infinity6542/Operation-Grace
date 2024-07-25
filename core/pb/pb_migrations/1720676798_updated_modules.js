/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nhhviqemfpbydnt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oey2j5so",
    "name": "static",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nhhviqemfpbydnt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oey2j5so",
    "name": "index2groupdefaultstatic",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})

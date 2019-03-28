const express = require('express')

let { getItems, setItem,deleteItem } = require('./controllers/query')

const router = express.Router()

router.route('/')
  .get(getItems)
  .post(setItem)
  .delete(deleteItem)

module.exports = router
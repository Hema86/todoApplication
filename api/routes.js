const express = require('express')

let { getItems, setItem, deleteAllItems, updateItemState, getCompletedItems,getInCompletedItems, setEditedItem, deleteItem } = require('./controllers/query')

const router = express.Router()

router.route('/')
  .get(getItems)
  .post(setItem)
  .delete(deleteAllItems)
router.route('/completedstate')
  .post(updateItemState)
  router.route('/completedtasks')
  .get(getCompletedItems)
  router.route('/incompletedtasks').get(getInCompletedItems)
  router.route('/updatedtask').post(setEditedItem)

router.route('/:id')
  .delete(deleteItem)

module.exports = router
const express = require('express')

let { getItems, setItem, updateItemState, setEditedItem, deleteItem, setTaskDetails } = require('./controllers/query')

const router = express.Router()

router.route('/').get(getItems)
router.route('/create').post(setItem)
router.route('/completedstate').post(updateItemState)
router.route('/updatedtask').post(setEditedItem)
router.route('/deletetask').post(deleteItem)
router.route('/updatedetails').post(setTaskDetails)
module.exports = router

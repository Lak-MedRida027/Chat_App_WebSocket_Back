const express = require('express')

const router = express.Router()

const { 
    createOrAccessChat, 
    getAllChats, 
    createGroup, 
    renameGroup, 
    removeFromGroup, 
    AddToGroup 
    } = require('../Services/chatService')
const { protect } = require('../middleware/authMiddleware')

router.route('/')
    .post(protect, createOrAccessChat)
    .get(protect, getAllChats)

router.route('/group').post(protect, createGroup)

router.route('/renameGroup').put(protect, renameGroup)
router.route('/AddToGroup').put(protect, AddToGroup)
router.route('/removeFromGroup').put(protect, removeFromGroup)

module.exports = router;
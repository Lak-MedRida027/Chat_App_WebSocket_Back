const express = require('express')

const router = express.Router()

const { sendMessage, getAllMessages} = require('../Services/messageService')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, getAllMessages)


module.exports = router;
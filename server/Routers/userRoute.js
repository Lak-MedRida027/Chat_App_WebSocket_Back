const express = require('express')

const router = express.Router()

const { searchOfUsers, getAllUsers } = require('../Services/userService')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, searchOfUsers)
router.route('/all').get(protect, getAllUsers)


module.exports = router;
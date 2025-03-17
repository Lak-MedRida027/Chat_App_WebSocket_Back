const express = require('express')

const router = express.Router()

const { signUp, logIn } = require('../Services/authService')

router.post('/signup', signUp)
router.post('/login', logIn)


module.exports = router;
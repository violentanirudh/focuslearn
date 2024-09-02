const express = require('express')
const router = express.Router()
const { postSignIn, postSignUp } = require('../controllers/auth')

router.post('/signin', postSignIn)
router.post('/signup', postSignUp)
// router.post('/signout', () => {})
// router.post('/verify', () => {})
// router.post('/reset', () => {})

module.exports = router
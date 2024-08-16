const express = require('express')
const router = express.Router()

const { renderHome } = require('../controllers/views')

router.get('/', renderHome)

module.exports = router
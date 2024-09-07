const express = require("express")
const router = express.Router()

const { renderImport } = require("../controllers/views")
const { handleImport } = require("../controllers/user")

router.get('/import-course', renderImport)
router.post('/import', handleImport)

module.exports = router
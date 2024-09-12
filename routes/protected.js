const express = require("express")
const router = express.Router()

const { renderImport, renderLearn } = require("../controllers/views")
const { handleImport, handleFeedback } = require("../controllers/user")

router.get('/import-course', renderImport)
router.get('/learn/:id', renderLearn)


router.post('/import', handleImport)
router.post('/feedback', handleFeedback)

module.exports = router
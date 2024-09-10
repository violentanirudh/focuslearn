const express = require("express")
const router = express.Router()

const { renderImport, renderCourse } = require("../controllers/views")
const { handleImport } = require("../controllers/user")

router.get('/import-course', renderImport)
router.get('/course/:id', renderCourse)


router.post('/import', handleImport)

module.exports = router
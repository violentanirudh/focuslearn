const express = require("express")
const router = express.Router()

const { renderImport, renderLearn, renderHome, renderProfile } = require("../controllers/views")
const { handleImport, handleFeedback, handleProgress, handleCourseEnroll } = require("../controllers/user")

router.get("/", renderHome);
router.get('/import-course', renderImport)
router.get('/learn/:id', renderLearn)
router.get('/profile', renderProfile)

router.post('/import-course', handleImport)
router.post('/feedback', handleFeedback)
router.post('/enroll/:id', handleCourseEnroll)
router.post("/progress", handleProgress);

module.exports = router
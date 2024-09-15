const express = require("express")
const router = express.Router()

const { renderImport, renderLearn, renderHome, renderAccount } = require("../controllers/views")
const { handleImport, handleFeedback, handleProgress, handleCourseEnroll, handleQuiz, handleQuizCreation } = require("../controllers/user")

router.get("/", renderHome);
router.get('/import-course', renderImport)
router.get('/learn/:id', renderLearn)
router.get('/account', renderAccount)
router.get('/generate/quiz/:id', handleQuizCreation)

router.post('/import-course', handleImport)
router.post('/feedback', handleFeedback)
router.post('/enroll/:id', handleCourseEnroll)
router.post("/progress", handleProgress);
router.post('/quiz/:id', handleQuiz)

module.exports = router
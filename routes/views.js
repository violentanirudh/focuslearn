const express = require("express");
const router = express.Router();

const {
  renderHome,
  renderSignIn,
  renderSignUp,
  renderCourse,
  searchCourses,
} = require("../controllers/views");

router.get("/", renderHome);
router.get("/signin", renderSignIn);
router.get("/signup", renderSignUp);
router.get("/preview/:id", renderCourse);
router.get("/search", searchCourses);

module.exports = router;

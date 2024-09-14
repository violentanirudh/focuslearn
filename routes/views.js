const express = require("express");
const router = express.Router();

const {
  renderLanding,
  renderSignIn,
  renderSignUp,
  renderCourse,
  renderPricing,
  searchCourses,
  renderCoursesList
} = require("../controllers/views");

router.get("/landing", renderLanding);
router.get("/signin", renderSignIn);
router.get("/signup", renderSignUp);
router.get("/course/:id", renderCourse);
router.get("/pricing", renderPricing);
router.get("/courses", renderCoursesList);
router.get("/search", searchCourses);

module.exports = router;

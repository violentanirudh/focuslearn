const express = require("express");
const router = express.Router();

const {
  renderHome,
  renderSignIn,
  renderSignUp,
  renderCourse
} = require("../controllers/views");

router.get("/", renderHome);
router.get("/signin", renderSignIn);
router.get("/signup", renderSignUp);
router.get("/preview/:id", renderCourse);

module.exports = router;

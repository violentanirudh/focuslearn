const express = require("express");
const router = express.Router();

const {
  renderHome,
  renderSignIn,
  renderSignUp,
  postSignUp,
  postSignIn,
} = require("../controllers/views");

router.get("/", renderHome);
router.get("/signin", renderSignIn);
router.get("/signup", renderSignUp);
router.post("/signup", postSignUp);
router.post("/signin", postSignIn);

module.exports = router;

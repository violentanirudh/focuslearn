const express = require("express");
const router = express.Router();

const {
  renderHome,
  renderSignIn,
  renderSignUp,
} = require("../controllers/views");

router.get("/", renderHome);
router.get("/signin", renderSignIn);
router.get("/signup", renderSignUp);

module.exports = router;

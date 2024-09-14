const express = require("express");
const router = express.Router();
const {
  postSignIn,
  postSignUp,
  verifyUser,
  signOut,
} = require("../controllers/auth");

router.post("/signin", postSignIn);
router.post("/signup", postSignUp);
router.get("/signout", signOut);
router.get("/verify", verifyUser);

module.exports = router;

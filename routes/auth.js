const express = require("express");
const router = express.Router();
const {
  postSignIn,
  postSignUp,
  verifyUser,
  signOut,
} = require("../controllers/auth");
const { validateSignup, validateSignin } = require("../middlewares/validators")

router.post("/signin", validateSignin, postSignIn);
router.post("/signup", validateSignup, postSignUp);
router.get("/signout", signOut);
router.get("/verify", verifyUser);

module.exports = router;

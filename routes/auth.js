const express = require("express");
const router = express.Router();
const {
  postSignIn,
  postSignUp,
  verifyUser,
  signOut,
} = require("../controllers/auth");
const {
  signInValidationRules,
  signUpValidationRules,
  validate,
} = require("../services/validators");

router.post("/signin", signInValidationRules(), validate, postSignIn);
router.post("/signup", signUpValidationRules(), validate, postSignUp);
router.get("/signout", signOut);
router.get("/verify", verifyUser);

module.exports = router;

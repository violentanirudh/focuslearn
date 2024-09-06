const express = require("express");
const router = express.Router();
const {
  postSignIn,
  postSignUp,
  verifyUser,
  signOut,
  postCourse,
} = require("../controllers/auth");

router.post("/signin", postSignIn);
router.post("/signup", postSignUp);
router.get("/signout", signOut);
router.get("/verify", verifyUser);
router.post("/importCourse", postCourse);
module.exports = router;

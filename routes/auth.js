const express = require("express");
const router = express.Router();
const {
  postSignIn,
  postSignUp,
  verifyUser,
  signOut,
  generatePlaylistId,
} = require("../controllers/auth");

router.post("/signin", postSignIn);
router.post("/signup", postSignUp);
router.get("/signout", signOut);
router.get("/verify", verifyUser);
router.post("/importCourse", generatePlaylistId);
module.exports = router;

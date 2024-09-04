const express = require("express");
const router = express.Router();
const { postSignIn, postSignUp, signOut } = require("../controllers/auth");
const verifyEmail = require("../controllers/verifymail");

router.post("/signin", postSignIn);
router.post("/signup", postSignUp);
router.get("/signout", signOut);
router.get("/verify", verifyEmail);
// router.post('/reset', () => {})

module.exports = router;

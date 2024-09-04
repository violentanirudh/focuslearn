const express = require("express");
const router = express.Router();
const { postSignIn, postSignUp, signout } = require("../controllers/auth");

router.post("/signin", postSignIn);
router.post("/signup", postSignUp);
router.post("/signout", signout);
// router.post('/verify', () => {})
// router.post('/reset', () => {})

module.exports = router;

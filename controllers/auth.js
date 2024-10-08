const User = require("../models/user");

// VALIDATION IS REQUIRED

const postSignUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (req.failure) return res.redirect("/signup");

  try {
    await User.create({
      fullName,
      email,
      password,
    });
  } catch (err) {
    req.flash("flash", { type: "info", text: "Email Already Registered!" });
    return res.redirect("/signup");
  }

  req.flash("flash", {
    type: "success",
    text: "Please verify your email address! For this tutorial, Email Verification is removed!",
  });
  res.redirect("/signup");
};

const postSignIn = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password)

  if (req.failure) return res.redirect("/signin");

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("user", token).redirect("/");
  } catch (err) {
    req.flash("flash", { type: "error", text: "Invalid Credentials!" });
    return res.redirect("/signin");
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;
  await User.findOneAndUpdate({ token }, { verified: true });
  return res.redirect("/signin");
};

const signOut = (req, res) => {
  res.clearCookie("user").redirect("/");
};

module.exports = {
  postSignUp,
  postSignIn,
  verifyUser,
  signOut,
};

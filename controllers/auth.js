const User = require("../models/user");
const Request = require("../models/requests");
const { validationResult } = require("express-validator");

// VALIDATION IS REQUIRED

const postSignUp = async (req, res) => {
  const errors = req.validationErrors || [];

  if (errors.length > 0) {
    // Re-render the form with errors and user input
    res.render("signup", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
    });
  } else {
    res.redirect("/signup-success");
  }
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });

  res.redirect("/signup?success=true");
};

const postSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("user", token).redirect("/");
  } catch (err) {
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

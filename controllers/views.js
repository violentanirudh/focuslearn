const User = require("../models/user");

const renderHome = (req, res) => {
  return res.render("home");
};

const renderSignIn = (req, res) => {
  return res.render("signin");
};

const renderSignUp = (req, res) => {
  return res.render("signup");
};

const postSignUp = async (req, res) => {
  const { fullname, email, password } = req.body;
  await User.create({
    fullname,
    email,
    password,
  });
  return res.redirect(renderSignIn);
};

const postSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect(renderHome);
  } catch (err) {
    return res.redirect(renderSignIn), { error: "Incorrect Email or Password" };
  }
};

module.exports = {
  renderHome,
  renderSignIn,
  renderSignUp,
  postSignUp,
  postSignIn,
};

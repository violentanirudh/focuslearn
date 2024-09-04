const User = require("../models/user");

const postSignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/signin");
};

const postSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.redirect("/signin");
  }
};

const signOut = (req, res) => {
  res.clearCookie("token").redirect("/");
};

module.exports = {
  postSignUp,
  postSignIn,
  signOut,
};

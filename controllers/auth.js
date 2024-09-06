const User = require("../models/user");
const Request = require("../models/requests");
const shortid = require("shortid");

// VALIDATION IS REQUIRED

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

async function generatePlaylistId(req, res) {
  const body = req.body;
  if (!body.course) return res.status(400).json({ error: "URL is required" });
  const playListID = shortid();

  await Request.create({
    playlistLink: req.body.course,
    requestedBy: req.user._id,
    playlistId: playListID,
  });
  return res.render("home", {
    Id: playListID,
  });
}

module.exports = {
  postSignUp,
  postSignIn,
  verifyUser,
  signOut,
  generatePlaylistId,
};

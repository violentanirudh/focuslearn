const User = require("../models/user");
const Requests = require("../models/requests");

const renderHome = (req, res) => {
  return res.render("home");
};

const renderSignIn = (req, res) => {
  return res.render("signin");
};

const renderSignUp = (req, res) => {
  return res.render("signup");
};

const renderAdminHome = async (req, res) => {
  const database = {
    requests: await Requests.find({}).populate('requestedBy', 'fullName'),
    users: await User.find({}),
  }
  return res.render("admin/home", database);
};

const renderImport = (req, res) => {
  return res.render("import");
};

module.exports = {
  renderHome,
  renderSignIn,
  renderSignUp,
  renderAdminHome,
  renderImport,
};

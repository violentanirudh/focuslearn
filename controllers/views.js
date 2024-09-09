const Requests = require("../models/request");
const User = require("../models/user");

// USER DASHBOARD VIEWS

const renderHome = (req, res) => {
  return res.render("home", { flash: req.flash('flash') });
};

const renderSignIn = (req, res) => {
  return res.render("signin", { flash: req.flash('flash') });
};

const renderSignUp = (req, res) => {
  res.render("signup", { flash: req.flash('flash') });
};

const renderImport = (req, res) => {
  return res.render("import");
};

// ADMIN DASHBOARD VIEWS

const renderAdminHome = async (req, res) => {
  const data = {
    requests: await Requests.find({}).populate("requestedBy"),
    users: await User.find({}),
  }
  return res.render("admin/home", data);
};

const renderAdminRequest = async (req, res) => {
  const id = req.params.id;
  const request = await Requests.findById(id).populate("requestedBy");
  if (!request) return res.redirect("/admin/dashboard");
  return res.render("admin/request", { request });
}

module.exports = {
  renderHome,
  renderSignIn,
  renderSignUp,
  renderImport,
  renderAdminHome,
  renderAdminRequest
};

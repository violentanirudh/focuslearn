const renderHome = (req, res) => {
  return res.render("home");
};

const renderSignIn = (req, res) => {
  return res.render("signin");
};

const renderSignUp = (req, res) => {
  res.render("signup", { errors: [], name: "", email: "" });
};

const renderAdminHome = (req, res) => {
  return res.render("admin/home");
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

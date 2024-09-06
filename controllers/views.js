const renderHome = (req, res) => {
  return res.render("home");
};

const renderSignIn = (req, res) => {
  return res.render("signin");
};

const renderSignUp = (req, res) => {
  return res.render("signup");
};

const renderAdminHome = (req, res) => {
  return res.render("admin/home");
};

const renderImportCourse = (req, res) => {
  return res.render("importCourse");
};

module.exports = {
  renderHome,
  renderSignIn,
  renderSignUp,
  renderAdminHome,
  renderImportCourse,
};

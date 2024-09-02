const renderHome = (req, res) => {
  return res.render("home");
};

const renderSignIn = (req, res) => {
  return res.render("signin");
};

const renderSignUp = (req, res) => {
  return res.render("signup");
};

module.exports = {
  renderHome,
  renderSignIn,
  renderSignUp,
};

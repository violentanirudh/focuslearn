const validator = require("validator");

// Middleware for validating and escaping signup fields
const validateSignup = (req, res, next) => {
  let { fullName, email, password } = req.body;

  // Escape inputs to avoid XSS attacks
  name = validator.escape(fullName);
  email = validator.escape(email);
  password = validator.escape(password);

  // Name validation (only alphabets and spaces)
  if (!name || !validator.isAlpha(name, "en-US", { ignore: " " })) {
    req.flash("flash", { type: 'error', text: "Name should only contain alphabets and spaces" });
    return res.redirect('back');
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    req.flash("flash", { type: 'error', text: "Invalid email format" });
    return res.redirect('back');
  }

  // Password validation
  if (!password || !validator.isStrongPassword(password)) {
    req.flash("flash", {
      type: 'error',
      text: "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol",
    });
    return res.redirect('back');
  }

  // Proceed to the next middleware or route handler
  next();
};

// Middleware for validating and escaping signin fields
const validateSignin = (req, res, next) => {
  let { email, password } = req.body;

  // Escape inputs to avoid XSS attacks
  email = validator.escape(email);
  password = validator.escape(password);

  // Email validation
  if (!email || !validator.isEmail(email)) {
    req.flash("flash", { type: 'error', text: "Invalid email format" });
    return res.redirect('back');
  }

  // Password validation (You can skip strong validation for signin if not needed)
  if (!password || password.length < 8) {
    req.flash("flash", { type: 'error', text: "Password must be at least 8 characters long" });
    return res.redirect('back');
  }

  // Proceed to the next middleware or route handler
  next();
};

// Middleware for validating and escaping the URL for importCourse
const validateImportCourse = (req, res, next) => {
  let { course } = req.body;

  // Escape the URL to avoid XSS attacks
  url = validator.escape(course);

  // URL validation
  if (!url || !validator.isURL(url)) {
    req.flash("flash", { type: 'error', text: "Invalid URL format" });
    return res.redirect('back');
  }

  // Proceed to the next middleware or route handler
  next();
};

module.exports = { validateSignup, validateSignin, validateImportCourse };

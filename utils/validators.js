const { body, validationResult } = require("express-validator");

// Validation and sanitization rules for sign-in
const signInValidationRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Must be a valid email address.")
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long.")
      .notEmpty()
      .withMessage("Email is required.")
      .normalizeEmail(), // Sanitizes the email address
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .isLength({ max: 128 })
      .withMessage("Password must be at most 128 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[@$!%*?&#]/)
      .withMessage(
        "Password must contain at least one special character (e.g., !, @, #, $, %)."
      )
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

// Validation and sanitization rules for sign-up
const signUpValidationRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Must be a valid email address.")
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long.")
      .notEmpty()
      .withMessage("Email is required.")
      .normalizeEmail(), // Sanitizes the email address

    body("fullname")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long.")
      .notEmpty()
      .withMessage("Username is required.")
      .isAlphanumeric()
      .withMessage("Name can only contain letters and numbers.")
      .trim(), // Sanitizes by trimming whitespace from the start and end
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .isLength({ max: 128 })
      .withMessage("Password must be at most 128 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[@$!%*?&#]/)
      .withMessage(
        "Password must contain at least one special character (e.g., !, @, #, $, %)."
      )
      .notEmpty()
      .withMessage("Password is required."),
    body("confirmPassword")
      .exists()
      .withMessage("Confirm Password is required.")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match."),
  ];
};

// Function to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { signInValidationRules, signUpValidationRules, validate };

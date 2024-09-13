const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");
const { sendMail } = require("../services/mailer");
// const Course = require("./course");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    courses: {
      type: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  this.token = randomBytes(32).toString("hex");

  next();
});

userSchema.post("save", async function () {
  const user = this;
  const subject = "Verification Email";
  const html = `<a href="${process.env.DOMAIN}/auth/verify?token=${user.token}">Click here to verify your email</a>`;
  await sendMail("verification", user.email, subject, html);
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect password!");

    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("User", userSchema);

module.exports = User;

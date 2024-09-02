const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Routers

const ViewsRouter = require("./routes/views");

// Database
mongoose
  .connect("mongodb://127.0.0.1:27017/focuslearn")
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("MongoDB Failed"));

// Routers
const ViewsRouter = require("./routes/views");
const AuthRouter = require("./routes/auth");

// Middlewares
const {} = require("middleware/authntication");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(checkForAuthenticationCookie("token"));

// Routes

app.use("/", ViewsRouter);
app.use("/auth", AuthRouter);
app.use(cookieParser());

// Server

app.listen(3000, () => {
  console.log("Listening On : http://127.0.0.1:3000");
});

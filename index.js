const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("MongoDB Failed"));

// Routers
const ViewsRouter = require("./routes/views");
const AuthRouter = require("./routes/auth");
const ProtectedRouter = require("./routes/protected");
const AdminRouter = require("./routes/admin");

// Middlewares
const {
  checkAuthentication,
  checkAuthorization,
} = require("./middlewares/authentication");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(checkAuthentication("token"));

// Routes

app.use("/", ViewsRouter);
app.use("/auth", AuthRouter);
app.use("/", checkAuthorization(['USER', 'ADMIN']), ProtectedRouter)
app.use("/admin", checkAuthorization(["ADMIN"]), AdminRouter);

// Server

app.listen(3000, () => {
  console.log("Listening On : http://127.0.0.1:3000");
});

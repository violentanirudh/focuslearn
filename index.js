const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Routers

const ViewsRouter = require("./routes/views");

// Middlewares
const {} = require("middleware/authntication");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(checkForAuthenticationCookie("token"));

// Routes

app.use("/", ViewsRouter);

// Server

app.listen(3000, () => {
  console.log("Listening On : http://127.0.0.1:3000");
});

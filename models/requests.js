const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const User = require("./user");

const requestSchema = new Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    playlistId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Request = model("Request", requestSchema);

module.exports = Request;

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const requestSchema = new Schema(
  {
    playlistLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "default",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    playlistId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Request = model("request", requestSchema);

module.exports = Request;

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const requestSchema = new Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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

const Request = model("request", requestSchema);

module.exports = Request;

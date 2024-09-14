const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  playlistId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  overview: {
    type: String,
  },
  instructor: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  lectures: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  students: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    default: "Beginner",
    required: true,
  },
});

const ProgressSchema = new mongoose.Schema({
  playlistId: { type: String, required: true },
  userId: { type: String, required: true },
  lectureStatus: [{ type: Boolean, default: false }],
});

const Course = mongoose.model("Course", courseSchema);
const Progress = mongoose.model("Progress", ProgressSchema);

module.exports = { Course, Progress };

const mongoose = require('mongoose');

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
        default: 0
    },
    students: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        default: 'Beginner',
        required: true,
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
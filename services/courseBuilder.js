const { Course } = require('../models/course');
const { processPlaylist } = require('../serverless/courses');
const { generateSlug } = require('./helpers');

generateCourse = async (playlistId) => {
    const content = await processPlaylist(playlistId);

    if (!content) {
        return false;
    }

    const { title, overview, instructor, duration, category, level, lectures } = content;

    const newCourse = new Course({
        title,
        slug: generateSlug(title),
        playlistId,
        overview,
        lectures,
        instructor, 
        duration,
        category, 
        level
    });

    try {
        await newCourse.save();
        return newCourse;
    } catch (error) {
        console.log(error.message)
        return false;
    }
}

module.exports = {
    generateCourse
}
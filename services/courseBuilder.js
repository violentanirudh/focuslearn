const { Course } = require('../models/course');
const { processPlaylist } = require('../serverless/courses');
const { generateSlug } = require('./helpers');

generateCourse = async (playlistId, update=false) => {
    const content = await processPlaylist(playlistId);

    if (!content) {
        return false;
    }

    const { title, overview, instructor, duration, category, level, lectures } = content;

    if (update) { 
        const course = await Course.findOne({ playlistId });
        course.title = title;
        course.overview = overview;
        course.instructor = instructor;
        course.duration = duration;
        course.category = category;
        course.level = level;
        course.lectures = lectures;

        try {
            await course.save();
            return course;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    } else {

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
}

module.exports = {
    generateCourse
}
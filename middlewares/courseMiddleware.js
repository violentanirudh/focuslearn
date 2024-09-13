// /middleware/courseMiddleware.js
const Course = require("../models/Course");

exports.filterCourses = async (req, res, next) => {
  try {
    const query = req.query.query || "";
    const level = req.query.level || "";

    // Construct filter object
    const filter = {};

    if (query) {
      filter.name = new RegExp(query, "i"); // Case-insensitive search
    }

    if (level) {
      filter.level = level; // Match level exactly
    }

    // Fetch filtered courses from MongoDB
    const filteredCourses = await Course.find(filter);

    req.filteredCourses = filteredCourses;
    req.query = query;
    req.level = level;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Another implementation
// // /middleware/courseMiddleware.js
// const allCourses = require('../data/courses'); // Assuming a course data file

// exports.filterCourses = (req, res, next) => {
//     const query = req.query.query || '';
//     const level = req.query.level || '';

//     let filteredCourses = allCourses.filter(course =>
//         course.name.toLowerCase().includes(query.toLowerCase())
//     );

//     if (level) {
//         filteredCourses = filteredCourses.filter(course => course.level === level);
//     }

//     // Attach the filtered data to req object
//     req.filteredCourses = filteredCourses;
//     req.query = query;
//     req.level = level;

//     next();
// };

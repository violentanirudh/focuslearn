const Request = require("../models/request");
const User = require("../models/user");
const { Course, Progress } = require("../models/course");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// USER DASHBOARD VIEWS

const renderLanding = (req, res) => {
  return res.render("landing");
};

const renderHome = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is set by authMiddleware

    // Fetch user with populated courses
    const user = await User.findById(userId).populate('courses');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get the user's progress for all courses
    const userProgress = await Progress.find({ userId });

    // Compute the results and find next lecture for each course
    const results = await Promise.all(user.courses.map(async (course) => {
      const progress = userProgress.find(p => p.playlistId === course.playlistId);
      
      let nextLectureIndex = 0;
      let completedLectures = 0;
      
      if (progress) {
        completedLectures = progress.lectureStatus.filter(status => status).length;
        
        // Find the last completed lecture
        const lastCompletedIndex = progress.lectureStatus.lastIndexOf(true);
        
        // Set next lecture index
        nextLectureIndex = lastCompletedIndex + 1;
        
        // If all lectures are completed, set to last lecture
        if (nextLectureIndex >= course.lectures) {
          nextLectureIndex = course.lectures - 1;
        }
      }

      const filename = path.join(__dirname, '..', `/public/courses/content/${course.playlistId}.json`);
      const file = await JSON.parse(fs.readFileSync(filename))

      return {
        playlistId: course.playlistId,
        title: course.title,
        slug: course.slug,
        instructor: course.instructor,
        category: course.category,
        level: course.level,
        totalLectures: course.lectures,
        completedLectures,
        percentComplete: ((completedLectures / course.lectures) * 100).toFixed(2),
        nextLectureIndex,
        duration: course.duration,
        rating: course.rating,
        students: course.students,
        nextTitle: file.course.lectures[nextLectureIndex].title,
      };
    }));
    // Render the home page with the results
    res.render('home', {
      courses: results
    });

  } catch (error) {
    console.error('Error in getHomePage:', error);
    res.status(500).json({ message: error.message });
  }
};

const renderSignIn = (req, res) => {
  return res.render("signin", { flash: req.flash("flash") });
};

const renderSignUp = (req, res) => {
  res.render("signup", { flash: req.flash("flash") });
};

const renderImport = (req, res) => {
  return res.render("import");
};

const renderProfile = (req, res) => {
  return res.render("profile");
};

const renderCourse = async (req, res) => {
  const id = req.params.id;
  let course = await Course.findOne({ slug: id });

  if (!course) {
    return res.status(404).redirect("/notfound")
  }

  return res.render("course", { course });
};

const renderLearn = async (req, res) => {
  const slug = req.params.id;
  let course = null;

  const user = await User.findById(req.user._id);

  try {
    course = await Course.findOne({ slug });
    if (user.courses.includes(course._id)) 
      return res.render("learn", { course })
  } catch (error) {
    req.flash("error", "Invalid Course Request");
    return res.redirect("/dashboard");
  }

  return res.render("learn", { course });
};

const renderCoursesList = async (req, res) => {
  const courses = await Course.find({});
  return res.render("courses", { courses });
}

const renderPricing = async (req, res) => {
  return res.render("pricing");
}

// ADMIN DASHBOARD VIEWS

const renderAdminHome = async (req, res) => {
  const data = {
    requests: await Request.find({}).populate("requestedBy"),
    users: await User.find({}),
  };
  return res.render("admin/home", data);
};

const renderAdminRequest = async (req, res) => {
  const id = req.params.id;
  let playlist = null;
  try {
    playlist = await Request.findById(id).populate("requestedBy");
  } catch (error) {
    req.flash("error", "Invalid Course Request");
    return res.redirect("/admin/dashboard");
  }

  try {
    const fetchPlaylistItems = async (playlistId, nextPageToken = null) => {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId,
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 50,
            pageToken: nextPageToken,
          },
        }
      );
      return response.data;
    };

    const playlistData = await fetchPlaylistItems(playlist.playlistId);
    const totalVideos = playlistData.pageInfo.totalResults;
    const channelName = playlistData.items[0].snippet.channelTitle;

    // Fetch all videos to get the final upload date
    let allItems = playlistData.items;
    let nextPageToken = playlistData.nextPageToken;

    while (nextPageToken) {
      const nextPageData = await fetchPlaylistItems(
        playlist.playlistId,
        nextPageToken
      );
      allItems = allItems.concat(nextPageData.items);
      nextPageToken = nextPageData.nextPageToken;
    }

    const lastActivity = allItems[allItems.length - 1].snippet.publishedAt;

    playlist.totalVideos = totalVideos;
    playlist.channel = channelName;
    playlist.lastActivity = lastActivity;
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Error fetching playlist data");
    return res.redirect("/admin/dashboard");
  }

  if (!playlist) return res.redirect("/admin/dashboard");
  return res.render("admin/request", { playlist });
};

const renderAdminCoursesList = async (req, res) => {
  const courses = await Course.find({});
  return res.render("admin/courses", { courses });
};

const renderAdminCourse = async (req, res) => {
  const id = req.params.id;
  let course = null;

  course = await Course.findOne({ playlistId: id });
  
  if (!course) {
    req.flash("error", "Invalid Course Request");
    return res.redirect("/admin/dashboard");
  }

  return res.render("admin/course", { course });
};

const renderAdminUsers = async (req, res) => {
  const users = await User.find({});
  return res.render("admin/users", { users });
};

const searchCourses = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from URL
    let courses = [];

    if (query) {
      console.log("Search query:", query); // Log query

      courses = await Course.find({
        title: { $regex: query, $options: "i" },
      });
      console.log("Found courses:", courses); // Log the search result
    }

    if (level) {
      filter.level = level;
    }

    // Render the search page with results and query
    res.render("search", { courses, query: query || "", level: level || "" });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res
      .status(500)
      .render("search", { courses: [], query: "", error: "An error occurred" });
  }
};

module.exports = {
  renderLanding,
  renderHome,
  renderSignIn,
  renderSignUp,
  renderImport,
  renderCourse,
  renderLearn,
  renderCoursesList,
  renderProfile,
  renderPricing,
  renderAdminHome,
  renderAdminCourse,
  renderAdminRequest,
  renderAdminCoursesList,
  renderAdminUsers,
  searchCourses,
};

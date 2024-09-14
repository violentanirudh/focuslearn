const Request = require("../models/request");
const User = require("../models/user");
const { Course, Progress } = require("../models/course");
const axios = require("axios");

// USER DASHBOARD VIEWS

const renderHome = (req, res) => {
  //  Get courses form user
  //  Get the users course progress
  //  Compute the results 
  //  Render the home page with the results
  return res.render("home", { flash: req.flash("flash") });
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

const renderCourse = async (req, res) => {
  const id = req.params.id;
  let course = await Course.findOne({ playlistId: id });

  if (!course) {
    return res.status(404).redirect("/notfound")
  }

  return res.render("course", { course });
};

const renderLearn = async (req, res) => {
  const id = req.params.id;
  let course = null;

  const user = await User.findById(req.user._id);

  try {
    course = await Course.findOne({ playlistId: id });
    if (user.courses.includes(course._id)) 
      return res.render("learn", { course })
  } catch (error) {
    req.flash("error", "Invalid Course Request");
    return res.redirect("/dashboard");
  }

  return res.render("learn", { course });
};

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
  renderHome,
  renderSignIn,
  renderSignUp,
  renderImport,
  renderCourse,
  renderLearn,
  renderAdminHome,
  renderAdminCourse,
  renderAdminRequest,
  renderAdminCoursesList,
  renderAdminUsers,
  searchCourses,
};

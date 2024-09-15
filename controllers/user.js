const axios = require('axios')
const Request = require('../models/request')
const Feedback = require('../models/feedback')
const User = require('../models/user')
const { Course, Progress } = require('../models/course')


async function handleImport(req, res) {
    const { course } = req.body;
    if (!course) return res.status(400).json({ error: "URL is required" });

    try {

        const url = new URL(course);
        const urlParams = new URLSearchParams(url.search);
        const list = urlParams.get('list');

        const response = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
            params: {
                playlistId: list,
                key: process.env.YOUTUBE_API_KEY,
            },
        });
            
        if (response.data.items.length > 0) {
            await Request.create({
                playlistId: list,
                requestedBy: req.user._id,
            });
            req.flash('flash', {type: 'success', text: 'Course request submitted!'});
            return res.redirect("/import-course");
        }
    } catch (error) {
        console.log(error.message)
    }

    req.flash('flash', {type: 'error', text: 'Invalid YouTube URL'});
    return res.status(500).redirect('/import-course')

}

const handleFeedback = async (req, res) => {
    const { feedback } = req.body;
    if (!feedback.trim()) return res.status(400).json({ error: "Feedback is required" });

    if (req.user === undefined) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (feedback.length > 400) {
        return res.status(400).json({ error: "Feedback is too long" });
    }

    try {
        await Feedback.create({
            user: req.user._id,
            feedback,
        });
        return res.status(201).json({ message: "Feedback submitted" });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "Internal server error" });
    }
}

const handleCourseEnroll = async (req, res) => {
    const slug = req.params.id;

    if (!playlistId || req.user === undefined) {
        req.flash('error', 'Invalid Request');
        return res.redirect('/');
    }

    try {
        const user = await User.findById(req.user._id);
        const course = await Course.findOne({ slug });

        if (!course || user.courses.includes(course._id) || user.courses.length >= 5) {
            req.flash('error', 'Invalid Request');
            return res.redirect('/');
        }
        
        await User.findByIdAndUpdate(
            user._id,
            { $push: { courses: course._id } },
            { new: true }
        );

        const progress = new Progress({
            playlistId,
            userId: req.user._id,
            lectureStatus: new Array(course.lectures).fill(false),
        });

        await progress.save();

        req.flash('success', 'Course enrolled');
        return res.redirect(`/learn/${playlistId}`);

    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Internal server error');
        return res.redirect('/');
    }
}

const handleProgress = async (req, res) => {
    try {
        const { playlistId, lectureIndex } = req.body;
        const userId = req.user._id;
    
        const course = await Course.findOne({ playlistId });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
  
        if (lectureIndex < 0 || lectureIndex >= course.lectureCount) {
            return res.status(400).json({ error: "Invalid lecture index" });
        }
  
        let progress = await Progress.findOne({ playlistId, userId });
        progress.lectureStatus[lectureIndex] = true;
        await progress.save();
  
        res.json(progress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    handleImport,
    handleFeedback,
    handleCourseEnroll,
    handleProgress,
}
const axios = require('axios')
const Request = require('../models/request')
const Feedback = require('../models/feedback')
const User = require('../models/user')

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
            return res.redirect("/import-course");
        } else {
            return res.status(404).json({ error: "Playlist not found" });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).redirect('/import-course')
    }
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
    const { courseId } = req.body;
    if (!courseId) {
        req.flash('error', 'Course ID is required');
        return res.redirect('/');
    }

    if (req.user === undefined) {
        req.flash('error', 'Unauthorized');
        return res.redirect('/');
    }

    try {
        const user = await User.findById(req.user._id);
        if (user.courses.includes(courseId)) {
            req.flash('error', 'Course already enrolled');
            return res.redirect('/');
        }

        user.courses.push(courseId);
        await user.save();
        req.flash('success', 'Course enrolled');
        return res.redirect(`/course/${courseId}`);
    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Internal server error');
        return res.redirect('/');
    }
}

module.exports = {
    handleImport,
    handleFeedback,
    handleCourseEnroll
}
const Request = require('../models/request');
const { Course } = require('../models/course');
const { generateQuiz } = require('../serverless/quiz');
const { generateCourse } = require('../services/courseBuilder');

handleAdminRequest = async (req, res) => {

    const id = req.params.id;
    console.log(req.body);
    try {
        if (req.body.approve !== undefined) {
            const request = await Request.findByIdAndUpdate(id, { $set: { status: 'approved' } });
            const course = await generateCourse(request.playlistId, true);
            req.flash('success', 'Course Request Approved');
            return res.redirect('/admin/course/' + request.playlistId);
        } else if (req.body.reject !== undefined) {
            await Request.findByIdAndDelete(id);
            req.flash('error', 'Course Request Rejected');
        } else {
            req.flash('error', 'Invalid Request');
        }
    } catch (error) {
        req.flash('error', 'Invalid Request');
        console.log(error);
    }

    return res.redirect('/admin/dashboard');

}

handleAdminCourseActions = async (req, res) => {
    try {
        if (req.body.content !== undefined) {
            const playlistId = req.params.id;
            const course = await Course.findOne({ playlistId })
            if (course) {
                await generateCourse(course.playlistId);
                return res.redirect('/admin/course/' + playlistId);
            }
        } else if (req.body.quiz !== undefined) {

            const playlistId = req.params.id;
            const course = await Course.findOne({ playlistId: playlistId });
            if (course) {
                await generateQuiz(playlistId);
                return res.redirect('/admin/course/' + playlistId);
            }
            req.flash('error', 'Course Deleted');

        } else if (req.body.delete !== undefined) {
            const playlistId = req.params.id;
            await Course.findOneAndDelete({ playlistId: playlistId });
            req.flash('error', 'Course Deleted');
        }
    } catch (error) {
        req.flash('error', 'Invalid Request');
        console.log(error.message);
    }

    return res.redirect('/admin/dashboard');
}


module.exports = {
    handleAdminRequest,
    handleAdminCourseActions
}
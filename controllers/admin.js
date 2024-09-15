const Request = require('../models/request');
const { Course } = require('../models/course');
const { generateQuiz } = require('../serverless/quiz');
const { generateNotes } = require('../serverless/notes');
const { generateCourse } = require('../services/courseBuilder');

handleAdminRequest = async (req, res) => {

    const id = req.params.id;
    console.log(req.body);
    try {
        if (req.body.approve !== undefined) {
            const request = await Request.findByIdAndUpdate(id, { $set: { status: 'approved' } });
            const course = await generateCourse(request.playlistId);
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
    console.log(req.body)
    try {
        if (req.body.content !== undefined) {
            const playlistId = req.params.id;
            const course = await Course.findOne({ playlistId })
            if (course) {
                await generateCourse(course.playlistId, true);
                req.flash('success', 'Course Updated');
                return res.redirect('/admin/course/' + playlistId);
            }
            req.flash('error', 'Unable to update course');
        } else if (req.body.quiz !== undefined) {

            const playlistId = req.params.id;
            const course = await Course.findOne({ playlistId: playlistId });
            if (course) {
                await generateQuiz(playlistId);
                req.flash('success', 'Quiz generated');
                return res.redirect('/admin/course/' + playlistId);
            }
            req.flash('error', 'Unable to generate quiz');

        } else if (req.body.notes !== undefined) {
                
            const playlistId = req.params.id;
            const course = await Course.findOne({ playlistId: playlistId });
            if (course) {
                await generateNotes(playlistId);
                req.flash('success', 'Notes generated');
                return res.redirect('/admin/course/' + playlistId);
            }   
            req.flash('error', 'Unable to generate notes');

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
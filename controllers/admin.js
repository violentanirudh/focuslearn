const Request = require('../models/request');
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

handleAdminCourseCreate = async (req, res) => {
    
    if (req.body.content) {
        
    }

    return res.redirect('/admin/dashboard');
}


module.exports = {
    handleAdminRequest
}
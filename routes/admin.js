const express = require('express');

const router = express.Router();
const { renderAdminHome, renderAdminRequest, renderAdminCourse, renderAdminCoursesList, renderAdminUsers } = require('../controllers/views');
const { handleAdminRequest, handleAdminCourseActions } = require('../controllers/admin');

// GET ROUTES

router.get('/dashboard', renderAdminHome);
router.get('/courses', renderAdminCoursesList);
router.get('/request/:id', renderAdminRequest);
router.get('/course/:id', renderAdminCourse);
router.get('/users', renderAdminUsers);

// POST ROUTES

router.post('/request/:id', handleAdminRequest);
router.post('/course/:id', handleAdminCourseActions);

module.exports = router;
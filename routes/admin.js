const express = require('express');

const router = express.Router();
const { renderAdminHome, renderAdminRequest, renderAdminCourse } = require('../controllers/views');
const { handleAdminRequest } = require('../controllers/admin');

// GET ROUTES

router.get('/dashboard', renderAdminHome);
router.get('/request/:id', renderAdminRequest);
router.get('/course/:id', renderAdminCourse);

// POST ROUTES

router.post('/request/:id', handleAdminRequest);

module.exports = router;
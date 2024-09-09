const express = require('express');

const router = express.Router();
const { renderAdminHome, renderAdminRequest } = require('../controllers/views');

router.get('/dashboard', renderAdminHome);
router.get('/request', renderAdminRequest);

module.exports = router;
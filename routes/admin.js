const express = require('express');

const router = express.Router();
const { renderAdminHome } = require('../controllers/views');

router.get('/dashboard', renderAdminHome);

module.exports = router;
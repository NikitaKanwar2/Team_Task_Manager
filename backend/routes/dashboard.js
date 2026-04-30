const express = require('express');
const { getStats } = require('../controllers/dashboard');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getStats);

module.exports = router;

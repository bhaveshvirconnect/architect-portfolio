const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');

const {
    submitContact,
    getMessages
} = require('../controllers/contactController');

// Public Route
router.post('/', submitContact);

// Admin Route
router.get('/', protect, getMessages);

module.exports = router;
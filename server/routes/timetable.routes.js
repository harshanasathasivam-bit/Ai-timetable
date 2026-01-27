const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { generateTimetable, getTimetables } = require('../controllers/timetable.controller');

router.post('/generate', protect, admin, generateTimetable);
router.get('/', protect, getTimetables);

module.exports = router;

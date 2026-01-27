const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createProgram, getPrograms,
    createCourse, getCourses,
    createRoom, getRooms,
    createFaculty, getFaculty,
    getStats
} = require('../controllers/data.controller');

// Stats
router.get('/stats', protect, getStats);

// Programs
router.route('/programs').get(getPrograms).post(protect, admin, createProgram);

// Courses
router.route('/courses').get(getCourses).post(protect, admin, createCourse);

// Rooms
router.route('/rooms').get(getRooms).post(protect, admin, createRoom);

// Faculty
router.route('/faculty').get(getFaculty).post(protect, admin, createFaculty);

module.exports = router;

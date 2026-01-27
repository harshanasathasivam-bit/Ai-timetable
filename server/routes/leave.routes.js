const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    applyLeave,
    getFacultyLeaves,
    getAllLeaves,
    updateLeaveStatus
} = require('../controllers/leave.controller');

router.route('/')
    .post(protect, applyLeave)
    .get(protect, getFacultyLeaves);

router.route('/admin')
    .get(protect, admin, getAllLeaves);

router.route('/:leaveId/status')
    .put(protect, admin, updateLeaveStatus);

module.exports = router;

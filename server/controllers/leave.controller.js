const Leave = require('../models/Leave');

// Global Mock Store for Leaves
global.MOCK_LEAVES = [];

exports.applyLeave = async (req, res) => {
    const { startDate, endDate, reason } = req.body;
    const facultyId = req.user.id;

    if (global.MOCK_MODE) {
        const newLeave = {
            _id: 'mock_leave_' + Date.now(),
            faculty: facultyId,
            facultyName: req.user.name, // Helpful for mock display
            startDate,
            endDate,
            reason,
            status: 'Pending',
            appliedAt: new Date()
        };
        global.MOCK_LEAVES.push(newLeave);
        return res.status(201).json(newLeave);
    }

    try {
        const leave = await Leave.create({
            faculty: facultyId,
            startDate,
            endDate,
            reason
        });
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getFacultyLeaves = async (req, res) => {
    const facultyId = req.user.id;

    if (global.MOCK_MODE) {
        const leaves = global.MOCK_LEAVES.filter(l => l.faculty === facultyId);
        return res.json(leaves);
    }

    try {
        const leaves = await Leave.find({ faculty: facultyId }).sort({ appliedAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllLeaves = async (req, res) => {
    if (global.MOCK_MODE) {
        return res.json(global.MOCK_LEAVES);
    }

    try {
        const leaves = await Leave.find().populate('faculty', 'name email').sort({ appliedAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (global.MOCK_MODE) {
        const leave = global.MOCK_LEAVES.find(l => l._id === leaveId);
        if (leave) {
            leave.status = status;
            return res.json(leave);
        }
        return res.status(404).json({ message: 'Leave not found' });
    }

    try {
        const leave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true });
        res.json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

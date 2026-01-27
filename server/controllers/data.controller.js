const Program = require('../models/Program');
const Course = require('../models/Course');
const Room = require('../models/Room');
const Faculty = require('../models/Faculty');

// Helper for Mock Mode
const mockCreate = (collection, data) => {
    const newItem = { _id: 'mock_' + Date.now(), ...data };
    collection.push(newItem);
    return newItem;
};

// --- Stats Controller ---
exports.getStats = async (req, res) => {
    if (global.MOCK_MODE) {
        return res.json({
            programs: global.MOCK_PROGRAMS.length,
            courses: global.MOCK_COURSES.length,
            faculty: global.MOCK_FACULTY.length,
            rooms: global.MOCK_ROOMS.length
        });
    }
    try {
        const programs = await Program.countDocuments();
        const courses = await Course.countDocuments();
        const faculty = await Faculty.countDocuments();
        const rooms = await Room.countDocuments();
        res.json({ programs, courses, faculty, rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Program Controllers ---
exports.createProgram = async (req, res) => {
    if (global.MOCK_MODE) return res.status(201).json(mockCreate(global.MOCK_PROGRAMS, req.body));
    try {
        const program = await Program.create(req.body);
        res.status(201).json(program);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPrograms = async (req, res) => {
    if (global.MOCK_MODE) return res.json(global.MOCK_PROGRAMS);
    try {
        const programs = await Program.find();
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Course Controllers ---
exports.createCourse = async (req, res) => {
    if (global.MOCK_MODE) return res.status(201).json(mockCreate(global.MOCK_COURSES, req.body));
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCourses = async (req, res) => {
    if (global.MOCK_MODE) return res.json(global.MOCK_COURSES);
    try {
        const courses = await Course.find().populate('program');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Room Controllers ---
exports.createRoom = async (req, res) => {
    if (global.MOCK_MODE) return res.status(201).json(mockCreate(global.MOCK_ROOMS, req.body));
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRooms = async (req, res) => {
    if (global.MOCK_MODE) return res.json(global.MOCK_ROOMS);
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Faculty Controllers ---
exports.createFaculty = async (req, res) => {
    if (global.MOCK_MODE) return res.status(201).json(mockCreate(global.MOCK_FACULTY, req.body));
    try {
        const faculty = await Faculty.create(req.body);
        res.status(201).json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getFaculty = async (req, res) => {
    if (global.MOCK_MODE) return res.json(global.MOCK_FACULTY);
    try {
        const faculty = await Faculty.find();
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

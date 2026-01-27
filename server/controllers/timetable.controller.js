const Timetable = require('../models/Timetable');
const Program = require('../models/Program');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Room = require('../models/Room');

// Helper for Mock Mode
const mockCreate = (collection, data) => {
    const newItem = { _id: 'mock_tt_' + Date.now(), ...data };
    collection.push(newItem);
    return newItem;
};

// Global Mock Store for Timetables
global.MOCK_TIMETABLES = [];

exports.generateTimetable = async (req, res) => {
    const { programId, semester, academicYear } = req.body;

    try {
        let program, courses, facultyList, rooms;

        if (global.MOCK_MODE) {
            program = global.MOCK_PROGRAMS.find(p => p._id === programId);
            courses = global.MOCK_COURSES.filter(c => c.program === programId && c.semester == semester); // Loose equality for string/number
            facultyList = global.MOCK_FACULTY;
            rooms = global.MOCK_ROOMS;
        } else {
            program = await Program.findById(programId);
            courses = await Course.find({ program: programId, semester });
            facultyList = await Faculty.find();
            rooms = await Room.find();
        }

        if (!courses || !courses.length) {
            return res.status(400).json({ message: 'No courses found for this semester. Please add courses first.' });
        }

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const periods = [1, 2, 3, 4, 5, 6, 7, 8];
        let schedule = [];

        // Simple Conflict-Free Logic
        // We need to track assignments to avoid clashes
        // In a real system, we'd query existing timetables. Here we just ensure internal consistency for this generated batch.

        let assignedSlots = new Set(); // Key: "Day-Period-FacultyID" and "Day-Period-RoomID"

        for (const day of days) {
            let dailySchedule = { day, periods: [] };

            for (const period of periods) {
                // Round-robin course selection
                const courseIndex = (period - 1) % courses.length;
                const course = courses[courseIndex];

                // Find a valid faculty
                // 1. Prioritize faculty with matching expertise
                // 2. Use round-robin to distribute load
                let assignedFaculty = null;

                // Sort faculty by current load in this generation to distribute evenly
                const facultyLoad = {};
                facultyList.forEach(f => {
                    facultyLoad[f._id] = [...assignedSlots].filter(s => s.endsWith(f._id)).length;
                });

                const sortedFaculty = [...facultyList].sort((a, b) => {
                    // Prioritize expertise
                    const aExpert = a.expertise?.some(e => course.code.includes(e) || course.title.includes(e));
                    const bExpert = b.expertise?.some(e => course.code.includes(e) || course.title.includes(e));
                    if (aExpert && !bExpert) return -1;
                    if (!aExpert && bExpert) return 1;

                    // Then by load
                    return facultyLoad[a._id] - facultyLoad[b._id];
                });

                for (const faculty of sortedFaculty) {
                    const key = `${day}-${period}-${faculty._id}`;
                    if (!assignedSlots.has(key)) {
                        assignedFaculty = faculty;
                        break;
                    }
                }

                // Find a valid room
                let assignedRoom = null;
                for (const room of rooms) {
                    const key = `${day}-${period}-${room._id}`;
                    if (!assignedSlots.has(key)) {
                        assignedRoom = room;
                        break;
                    }
                }

                // Fallback
                if (!assignedFaculty) assignedFaculty = facultyList[Math.floor(Math.random() * facultyList.length)];
                if (!assignedRoom) assignedRoom = rooms[Math.floor(Math.random() * rooms.length)];

                if (course && assignedFaculty && assignedRoom) {
                    // Mark as booked
                    assignedSlots.add(`${day}-${period}-${assignedFaculty._id}`);
                    assignedSlots.add(`${day}-${period}-${assignedRoom._id}`);

                    dailySchedule.periods.push({
                        periodNumber: period,
                        course: course._id,
                        faculty: assignedFaculty._id,
                        room: assignedRoom._id,
                        type: course.type
                    });
                }
            }
            schedule.push(dailySchedule);
        }

        const timetableData = {
            program: programId,
            semester,
            academicYear,
            schedule
        };

        if (global.MOCK_MODE) {
            // Populate mock data for response
            const newTT = mockCreate(global.MOCK_TIMETABLES, timetableData);
            // Manually populate for the frontend response
            const populatedTT = {
                ...newTT,
                program: program,
                schedule: newTT.schedule.map(day => ({
                    ...day,
                    periods: day.periods.map(p => ({
                        ...p,
                        course: courses.find(c => c._id === p.course),
                        faculty: facultyList.find(f => f._id === p.faculty),
                        room: rooms.find(r => r._id === p.room)
                    }))
                }))
            };
            return res.status(201).json(populatedTT);
        }

        const newTimetable = await Timetable.create(timetableData);
        const populatedTimetable = await Timetable.findById(newTimetable._id)
            .populate('program')
            .populate('schedule.periods.course')
            .populate('schedule.periods.faculty')
            .populate('schedule.periods.room');
        res.status(201).json(populatedTimetable);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Timetable generation failed', error: error.message });
    }
};

exports.getTimetables = async (req, res) => {
    if (global.MOCK_MODE) {
        // We need to "populate" the mock data manually
        const populatedTimetables = global.MOCK_TIMETABLES.map(tt => {
            const program = global.MOCK_PROGRAMS.find(p => p._id === tt.program);
            const schedule = tt.schedule.map(day => ({
                ...day,
                periods: day.periods.map(p => ({
                    ...p,
                    course: global.MOCK_COURSES.find(c => c._id === p.course),
                    faculty: global.MOCK_FACULTY.find(f => f._id === p.faculty),
                    room: global.MOCK_ROOMS.find(r => r._id === p.room)
                }))
            }));
            return { ...tt, program, schedule };
        });
        return res.json(populatedTimetables);
    }

    try {
        const timetables = await Timetable.find()
            .populate('program')
            .populate('schedule.periods.course')
            .populate('schedule.periods.faculty')
            .populate('schedule.periods.room');
        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

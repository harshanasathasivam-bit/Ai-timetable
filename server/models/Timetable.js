const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    semester: { type: Number, required: true },
    section: { type: String, default: 'A' },
    academicYear: { type: String, required: true }, // e.g., "2023-24"
    schedule: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        periods: [{
            periodNumber: { type: Number, required: true },
            course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
            room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
            type: { type: String, enum: ['Theory', 'Practical', 'Tutorial'] }
        }]
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);

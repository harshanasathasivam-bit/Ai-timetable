const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    designation: { type: String },
    department: { type: String },
    expertise: [{ type: String }], // Subject codes or keywords
    maxLoad: { type: Number, default: 16 }, // Max hours per week
    availableSlots: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        periods: [{ type: Number }] // 1-8
    }],
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);

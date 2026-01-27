const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    credits: { type: Number, required: true },
    type: { type: String, enum: ['Theory', 'Practical', 'Tutorial'], required: true },
    category: {
        type: String,
        enum: ['Major', 'Minor', 'Skill', 'AEC', 'VAC', 'Core'],
        required: true
    },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    semester: { type: Number, required: true },
    hoursPerWeek: { type: Number, required: true }, // Derived from credits usually, but explicit here
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

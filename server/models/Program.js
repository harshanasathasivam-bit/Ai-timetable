const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "B.Sc. Computer Science"
    code: { type: String, required: true, unique: true }, // e.g., "BSC-CS"
    type: { type: String, enum: ['FYUP', 'B.Ed', 'M.Ed', 'ITEP'], required: true },
    semesters: [{ type: Number }], // e.g., [1, 2, 3, 4, 5, 6, 7, 8]
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Room 101"
    capacity: { type: Number, required: true },
    type: { type: String, enum: ['Classroom', 'Lab', 'Seminar Hall'], default: 'Classroom' },
    features: [{ type: String }], // e.g., "Projector", "Computers"
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);

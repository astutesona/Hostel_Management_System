const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNo: { type: String, required: true, unique: true },
    capacity: { type: Number, default: 2 },
    occupied: { type: Number, default: 0 },
    status: { type: String, default: 'Available' } // 'Available', 'Full'
});

module.exports = mongoose.model('Room', roomSchema);

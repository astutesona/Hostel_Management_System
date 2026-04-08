const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    leaveReason: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
    requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leave', leaveSchema);

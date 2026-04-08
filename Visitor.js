const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    studentToVisit: { type: String, required: true },
    purpose: { type: String },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date }
});

module.exports = mongoose.model('Visitor', visitorSchema);

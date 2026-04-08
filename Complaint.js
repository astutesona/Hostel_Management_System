const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, default: 'Pending' } // 'Pending', 'Resolved'
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

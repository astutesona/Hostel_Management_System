const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    room: { type: String, default: 'Not Assigned' },
    role: { type: String, default: 'Student' },
    fees: {
        total: { type: Number, default: 50000 },
        paid: { type: Number, default: 0 },
        status: { type: String, default: 'Unpaid' }
    },
    joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

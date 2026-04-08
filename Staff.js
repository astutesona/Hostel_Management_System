const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    shift: { type: String, required: true },
    salary: { type: Number, required: true },
    contact: { type: String, required: true },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);

const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    day: { type: String, required: true, unique: true },
    breakfast: { type: String, default: 'Not Set' },
    lunch: { type: String, default: 'Not Set' },
    snacks: { type: String, default: 'Not Set' },
    dinner: { type: String, default: 'Not Set' },
});

module.exports = mongoose.model('Menu', menuSchema);

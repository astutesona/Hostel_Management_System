const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all for now, can be restricted to netlify url later
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());

const Admin = require('./models/Admin');

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hostelDB';
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');
        try {
            const AdminModel = mongoose.models.Admin || mongoose.model('Admin');
            // Seed/Reset default admin
            let admin = await AdminModel.findOne({ username: 'admin' });
            if (!admin) {
                admin = new AdminModel({ username: 'admin', password: 'password123' });
                await admin.save();
                console.log('👤 Default Admin Created: admin / password123');
            } else {
                // Force reset password to ensure it matches hashing logic
                admin.password = 'password123';
                await admin.save();
                console.log('👤 Default Admin Password Reset: admin / password123');
            }
        } catch (seedErr) {
            console.error('❌ Seeding Error:', seedErr.message);
        }
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('🏠 Hostel Management API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT);
});

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');

const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// --- Public Auth Routes ---

// @route   POST /login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, admin: { id: admin._id, username: admin.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) return res.status(400).json({ error: 'Username already taken' });

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(201).json({ token, admin: { id: newAdmin._id, username: newAdmin.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PROTECTED ROUTES BELOW ---
// Apply auth middleware to all subsequent routes
router.use(auth);

// @route   GET /me
// @desc    Get current admin profile
router.get('/me', async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Student Routes ---

// @route   POST /addStudent
// @desc    Register a new student
router.post('/addStudent', async (req, res) => {
    try {
        const { name, email, phone, joinDate } = req.body;
        const newStudent = new Student({ name, email, phone, joinDate: joinDate || Date.now() });
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully', student: newStudent });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /students
// @desc    Get all students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /deleteStudent/:id
// @desc    Delete a student
router.delete('/deleteStudent/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /editStudent/:id
// @desc    Edit a student's info
router.put('/editStudent/:id', async (req, res) => {
    try {
        const { name, email, phone, joinDate } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            { name, email, phone, joinDate }, 
            { new: true }
        );
        res.json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Room Routes ---

// @route   POST /addRoom
// @desc    Add a new room
router.post('/addRoom', async (req, res) => {
    try {
        const { roomNo, capacity } = req.body;
        const newRoom = new Room({ roomNo, capacity });
        await newRoom.save();
        res.status(201).json({ message: 'Room added successfully', room: newRoom });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /rooms
// @desc    Get all rooms
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /assignRoom
// @desc    Assign a room to a student manually
router.post('/assignRoom', async (req, res) => {
    try {
        const { studentId, roomNo } = req.body;
        
        // Find student and update room
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        
        const oldRoomNo = student.room;
        student.room = roomNo;
        await student.save();
        
        // Update room occupancy
        await Room.findOneAndUpdate({ roomNo: oldRoomNo }, { $inc: { occupied: -1 } });
        await Room.findOneAndUpdate({ roomNo: roomNo }, { $inc: { occupied: 1 } });
        
        res.json({ message: 'Room assigned successfully', student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Complaint Routes ---

// @route   POST /addComplaint
// @desc    Submit a complaint
router.post('/addComplaint', async (req, res) => {
    try {
        const { studentName, studentEmail, issue } = req.body;
        const newComplaint = new Complaint({ studentName, studentEmail, issue });
        await newComplaint.save();
        res.status(201).json({ message: 'Complaint submitted', complaint: newComplaint });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /complaints
// @desc    Get all complaints
router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PATCH /resolveComplaint/:id
// @desc    Mark complaint as resolved
router.patch('/resolveComplaint/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
        res.json({ message: 'Complaint resolved', complaint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Fee Routes ---

// @route   PATCH /updateFee/:id
// @desc    Update fee payment status
router.patch('/updateFee/:id', async (req, res) => {
    try {
        const { paidAmount } = req.body;
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).json({ error: 'Student not found' });

        student.fees.paid += Number(paidAmount);
        if(student.fees.paid >= student.fees.total) {
            student.fees.status = 'Paid';
        } else {
            student.fees.status = 'Partial';
        }
        await student.save();
        res.json({ message: 'Fee updated successfully', student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const Notice = require('../models/Notice');

// --- Notice Routes ---

// @route   POST /addNotice
// @desc    Add a new notice announcement
router.post('/addNotice', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNotice = new Notice({ title, content });
        await newNotice.save();
        res.status(201).json({ message: 'Notice added successfully', notice: newNotice });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /notices
// @desc    Get all notices
router.get('/notices', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /deleteNotice/:id
// @desc    Delete a notice
router.delete('/deleteNotice/:id', async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const Visitor = require('../models/Visitor');
const Menu = require('../models/Menu');

// --- Visitor Routes ---

// @route   POST /addVisitor
router.post('/addVisitor', async (req, res) => {
    try {
        const { visitorName, studentToVisit, purpose } = req.body;
        const newVisitor = new Visitor({ visitorName, studentToVisit, purpose });
        await newVisitor.save();
        res.status(201).json({ message: 'Visitor added successfully', visitor: newVisitor });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /visitors
router.get('/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ checkInTime: -1 });
        res.json(visitors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PATCH /checkoutVisitor/:id
router.patch('/checkoutVisitor/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(req.params.id, { checkOutTime: Date.now() }, { new: true });
        res.json({ message: 'Visitor checked out', visitor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Menu Routes ---

// @route   GET /menu
router.get('/menu', async (req, res) => {
    try {
        const menu = await Menu.find();
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /updateMenu/:day
router.put('/updateMenu/:day', async (req, res) => {
    try {
        const { breakfast, lunch, snacks, dinner } = req.body;
        const updatedMenu = await Menu.findOneAndUpdate(
            { day: req.params.day },
            { day: req.params.day, breakfast, lunch, snacks, dinner },
            { new: true, upsert: true }
        );
        res.json({ message: 'Menu updated successfully', menu: updatedMenu });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const Staff = require('../models/Staff');
const Leave = require('../models/Leave');

// --- Staff Routes ---

// @route   POST /addStaff
router.post('/addStaff', async (req, res) => {
    try {
        const { name, role, shift, salary, contact } = req.body;
        const newStaff = new Staff({ name, role, shift, salary, contact });
        await newStaff.save();
        res.status(201).json({ message: 'Staff added successfully', staff: newStaff });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /staff
router.get('/staff', async (req, res) => {
    try {
        const staffList = await Staff.find().sort({ joinDate: -1 });
        res.json(staffList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /deleteStaff/:id
router.delete('/deleteStaff/:id', async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- Leave Routes ---

// @route   POST /addLeave
router.post('/addLeave', async (req, res) => {
    try {
        const { studentName, leaveReason, departureDate, returnDate } = req.body;
        const newLeave = new Leave({ studentName, leaveReason, departureDate, returnDate });
        await newLeave.save();
        res.status(201).json({ message: 'Leave request submitted', leave: newLeave });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /leaves
router.get('/leaves', async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ requestDate: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PATCH /updateLeaveStatus/:id
router.patch('/updateLeaveStatus/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Denied'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
        
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ message: `Leave ${status}`, leave });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

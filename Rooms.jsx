import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DoorOpen, UserCheck } from 'lucide-react';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [newRoom, setNewRoom] = useState({ roomNo: '', capacity: 2 });
    const [assignment, setAssignment] = useState({ studentId: '', roomNo: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, studentsRes] = await Promise.all([
                api.get('/rooms'),
                api.get('/students')
            ]);
            setRooms(roomsRes.data);
            setStudents(studentsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('/addRoom', newRoom);
            setNewRoom({ roomNo: '', capacity: 2 });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            alert('Error adding room: ' + errorMsg);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignRoom', assignment);
            setAssignment({ studentId: '', roomNo: '' });
            fetchData();
            alert('Room assigned successfully!');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            alert('Error assigning room: ' + errorMsg);
        }
    };

    return (
        <div>
            <h1>Room Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <div className="card">
                    <h3><DoorOpen size={18} style={{ marginRight: '8px' }} /> Add New Room</h3>
                    <form onSubmit={handleAddRoom}>
                        <label>Room Number</label>
                        <input type="text" placeholder="e.g. 101" value={newRoom.roomNo} onChange={(e) => setNewRoom({...newRoom, roomNo: e.target.value})} required />
                        <label>Capacity</label>
                        <input type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})} required />
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Room</button>
                    </form>

                    <h3 style={{ marginTop: '2rem' }}><UserCheck size={18} style={{ marginRight: '8px' }} /> Assign Room</h3>
                    <form onSubmit={handleAssign}>
                        <label>Select Student</label>
                        <select value={assignment.studentId} onChange={(e) => setAssignment({...assignment, studentId: e.target.value})} required>
                            <option value="">-- Choose Student --</option>
                            {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.room})</option>)}
                        </select>
                        <label>Select Room</label>
                        <select value={assignment.roomNo} onChange={(e) => setAssignment({...assignment, roomNo: e.target.value})} required>
                            <option value="">-- Choose Room --</option>
                            {rooms.map(r => <option key={r._id} value={r.roomNo}>{r.roomNo} ({r.occupied}/{r.capacity})</option>)}
                        </select>
                        <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--accent)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)' }}>Assign Room</button>
                    </form>
                </div>

                <div className="card">
                    <h3>Current Rooms</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Room No</th>
                                <th>Capacity</th>
                                <th>Occupied</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room._id}>
                                    <td>{room.roomNo}</td>
                                    <td>{room.capacity}</td>
                                    <td>{room.occupied}</td>
                                    <td>
                                        <span className={`badge ${room.occupied >= room.capacity ? 'badge-danger' : 'badge-success'}`}>
                                            {room.occupied >= room.capacity ? 'Full' : 'Available'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Rooms;

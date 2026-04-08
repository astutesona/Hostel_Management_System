import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Trash2, IndianRupee, Edit2 } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', joinDate: '' });
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/editStudent/${editId}`, formData);
                setEditId(null);
            } else {
                await api.post('/addStudent', formData);
            }
            setFormData({ name: '', email: '', phone: '', joinDate: '' });
            fetchStudents();
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            alert(`Error ${editId ? 'updating' : 'adding'} student: ` + errorMsg);
        }
    };

    const handleEditClick = (student) => {
        setEditId(student._id);
        const jd = student.joinDate ? new Date(student.joinDate).toISOString().split('T')[0] : '';
        setFormData({ name: student.name, email: student.email, phone: student.phone, joinDate: jd });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditId(null);
        setFormData({ name: '', email: '', phone: '', joinDate: '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/deleteStudent/${id}`);
                fetchStudents();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleUpdateFee = async (id) => {
        const amount = prompt('Enter amount paid:');
        if (amount) {
            try {
                await api.patch(`/updateFee/${id}`, { paidAmount: amount });
                fetchStudents();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h1>Student Management</h1>
            
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}><UserPlus size={18} style={{ marginRight: '8px' }} /> {editId ? 'Edit Student Details' : 'Register New Student'}</h3>
                    {editId && <button onClick={cancelEdit} className="btn-primary" style={{ backgroundColor: 'var(--text-muted)' }}>Cancel Edit</button>}
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label>Name</label>
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div>
                        <label>Join Date</label>
                        <input type="date" value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ height: '45px', marginBottom: '1rem' }}>{editId ? 'Update' : 'Register'}</button>
                </form>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>All Students</h3>
                    <div style={{ width: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ marginBottom: 0, padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Room</th>
                            <th>Join Date</th>
                            <th>Fee Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.filter(s => 
                            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(student => (
                            <tr key={student._id}>
                                <td>
                                    <div style={{ fontWeight: 700 }}>{student.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.phone}</div>
                                </td>
                                <td>{student.email}</td>
                                <td>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>{student.room}</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                        {new Date(student.joinDate || student.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ color: student.fees.status === 'Paid' ? 'var(--accent)' : 'var(--danger)', fontWeight: 600 }}>
                                        {student.fees.status} (₹{student.fees.paid})
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(student)} style={{ marginRight: '8px', color: 'var(--primary)', background: 'none' }} title="Edit">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleUpdateFee(student._id)} style={{ marginRight: '8px', color: 'var(--accent)', background: 'none' }} title="Pay Fees">
                                        <IndianRupee size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(student._id)} style={{ color: 'var(--danger)', background: 'none' }} title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Students;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, Briefcase, Trash2 } from 'lucide-react';

const StaffPanel = () => {
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({ name: '', role: '', shift: '', salary: '', contact: '' });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/staff');
            setStaff(res.data);
        } catch (err) {
            console.error('Error fetching staff:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/addStaff', formData);
            setFormData({ name: '', role: '', shift: '', salary: '', contact: '' });
            fetchStaff();
        } catch (err) {
            console.error('Failed to add staff:', err);
            alert('Failed to register staff member.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this staff member permanently?')) return;
        try {
            await api.delete(`/deleteStaff/${id}`);
            fetchStaff();
        } catch (err) {
            console.error('Failed to delete staff:', err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Briefcase color="var(--primary)" size={28} />
                <h1 style={{ margin: 0 }}>Staff Management</h1>
            </div>

            <div className="card">
                <h3>Register Staff Member</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label>Name</label>
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label>Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required>
                            <option value="">Select Role</option>
                            <option value="Warden">Warden</option>
                            <option value="Security">Security</option>
                            <option value="Cleaner">Cleaner</option>
                            <option value="Cook">Cook</option>
                            <option value="Electrician">Electrician</option>
                        </select>
                    </div>
                    <div>
                        <label>Shift Time</label>
                        <select value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})} required>
                            <option value="">Select Shift</option>
                            <option value="Morning">Morning (6 AM - 2 PM)</option>
                            <option value="Evening">Evening (2 PM - 10 PM)</option>
                            <option value="Night">Night (10 PM - 6 AM)</option>
                        </select>
                    </div>
                    <div>
                        <label>Salary (₹)</label>
                        <input type="number" placeholder="eg. 15000" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} required />
                    </div>
                    <div>
                        <label>Contact Number</label>
                        <input type="text" placeholder="Phone" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '45px', marginBottom: '1.25rem' }}>
                        {loading ? 'Adding...' : 'Add To Payroll'}
                    </button>
                </form>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Current Staff Directory</h3>
                    <div style={{ width: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by name or role..." 
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
                            <th>Role</th>
                            <th>Shift</th>
                            <th>Contact</th>
                            <th>Salary</th>
                            <th>Status / Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No staff registered.</td></tr>
                        ) : staff.filter(member => 
                            member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            member.role.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(member => (
                            <tr key={member._id}>
                                <td style={{ fontWeight: 600 }}>{member.name}</td>
                                <td><span className="badge badge-pending">{member.role}</span></td>
                                <td>{member.shift}</td>
                                <td>{member.contact}</td>
                                <td>₹{member.salary}</td>
                                <td>
                                    <button onClick={() => handleDelete(member._id)} style={{ color: 'var(--danger)', background: 'none', border: '1px solid var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                        <Trash2 size={14} /> Remove
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

export default StaffPanel;

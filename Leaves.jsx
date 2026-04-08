import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LogOut, CheckCircle, XCircle } from 'lucide-react';

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({ studentName: '', leaveReason: '', departureDate: '', returnDate: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (err) {
            console.error('Error fetching leaves:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/addLeave', formData);
            setFormData({ studentName: '', leaveReason: '', departureDate: '', returnDate: '' });
            fetchLeaves();
        } catch (err) {
            console.error('Failed to submit leave:', err);
            alert('Failed to submit leave request.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/updateLeaveStatus/${id}`, { status });
            fetchLeaves();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <LogOut color="var(--primary)" size={28} />
                <h1 style={{ margin: 0 }}>Gate Pass / Leave Requests</h1>
            </div>

            <div className="card">
                <h3>Submit New Leave Request</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label>Student Name</label>
                        <input type="text" placeholder="Name or Roll No" value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} required />
                    </div>
                    <div>
                        <label>Departure Date</label>
                        <input type="date" value={formData.departureDate} onChange={(e) => setFormData({...formData, departureDate: e.target.value})} required />
                    </div>
                    <div>
                        <label>Return Date</label>
                        <input type="date" value={formData.returnDate} onChange={(e) => setFormData({...formData, returnDate: e.target.value})} required />
                    </div>
                    <div>
                        <label>Reason</label>
                        <input type="text" placeholder="Brief reason" value={formData.leaveReason} onChange={(e) => setFormData({...formData, leaveReason: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '45px', marginBottom: '1.25rem' }}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>Pending & Authorized Passes</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Reason</th>
                            <th>Departure &rarr; Return</th>
                            <th>Status / Auth</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No leave requests found.</td></tr>
                        ) : leaves.map(leave => (
                            <tr key={leave._id}>
                                <td style={{ fontWeight: 600 }}>{leave.studentName}</td>
                                <td>{leave.leaveReason}</td>
                                <td>{new Date(leave.departureDate).toLocaleDateString()} to {new Date(leave.returnDate).toLocaleDateString()}</td>
                                <td>
                                    {leave.status === 'Pending' && <span className="badge badge-pending">Pending</span>}
                                    {leave.status === 'Approved' && <span className="badge badge-success">Approved</span>}
                                    {leave.status === 'Denied' && <span className="badge badge-danger">Denied</span>}
                                </td>
                                <td>
                                    {leave.status === 'Pending' ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => updateStatus(leave._id, 'Approved')} style={{ color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button onClick={() => updateStatus(leave._id, 'Denied')} style={{ color: 'var(--danger)', background: 'none', border: '1px solid var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                <XCircle size={14} /> Deny
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actioned</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaves;

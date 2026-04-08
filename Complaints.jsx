import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', issue: '' });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/addComplaint', {
                studentName: formData.name,
                studentEmail: formData.email,
                issue: formData.issue
            });
            setFormData({ name: '', email: '', issue: '' });
            fetchComplaints();
            alert('Complaint submitted!');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            alert('Error submitting complaint: ' + errorMsg);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.patch(`/resolveComplaint/${id}`);
            fetchComplaints();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Complaint Redressal</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="card">
                    <h3><AlertCircle size={18} style={{ marginRight: '8px' }} /> Submit Complaint</h3>
                    <form onSubmit={handleSubmit}>
                        <label>Student Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        <label>Student Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        <label>Issue / Description</label>
                        <textarea rows="4" value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})} required />
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
                    </form>
                </div>

                <div className="card">
                    <h3>Recent Complaints</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Issue</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id}>
                                    <td>{c.studentName}</td>
                                    <td>{c.issue}</td>
                                    <td>
                                        <span className={`badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-pending'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        {c.status === 'Pending' && (
                                            <button onClick={() => handleResolve(c._id)} style={{ color: '#10b981', background: 'none' }}>
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
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

export default Complaints;

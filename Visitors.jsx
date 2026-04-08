import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Clock, CheckCircle } from 'lucide-react';

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [formData, setFormData] = useState({ visitorName: '', studentToVisit: '', purpose: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const res = await api.get('/visitors');
            setVisitors(res.data);
        } catch (err) {
            console.error('Error fetching visitors:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/addVisitor', formData);
            setFormData({ visitorName: '', studentToVisit: '', purpose: '' });
            fetchVisitors();
        } catch (err) {
            console.error('Failed to add visitor:', err);
            alert('Failed to log visitor.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (id) => {
        if (!window.confirm('Check out this visitor?')) return;
        try {
            await api.patch(`/checkoutVisitor/${id}`);
            fetchVisitors();
        } catch (err) {
            console.error('Failed to checkout:', err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Users color="var(--primary)" size={28} />
                <h1 style={{ margin: 0 }}>Visitor Log</h1>
            </div>

            <div className="card">
                <h3>Log New Visitor</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label>Visitor Name</label>
                        <input type="text" placeholder="Full Name" value={formData.visitorName} onChange={(e) => setFormData({...formData, visitorName: e.target.value})} required />
                    </div>
                    <div>
                        <label>Student To Visit</label>
                        <input type="text" placeholder="Roll No / Name" value={formData.studentToVisit} onChange={(e) => setFormData({...formData, studentToVisit: e.target.value})} required />
                    </div>
                    <div>
                        <label>Purpose</label>
                        <input type="text" placeholder="Reason for visit" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '45px', marginBottom: '1.25rem' }}>
                        {loading ? 'Logging...' : 'Sign In'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>Visitor History</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Visitor</th>
                            <th>Student</th>
                            <th>Purpose</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitors.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No visitors logged yet.</td></tr>
                        ) : visitors.map(v => (
                            <tr key={v._id}>
                                <td style={{ fontWeight: 600 }}>{v.visitorName}</td>
                                <td>{v.studentToVisit}</td>
                                <td>{v.purpose || '-'}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{new Date(v.checkInTime).toLocaleString()}</td>
                                <td>
                                    {v.checkOutTime ? (
                                        <span className="badge badge-success">
                                            {new Date(v.checkOutTime).toLocaleTimeString()}
                                        </span>
                                    ) : (
                                        <span className="badge badge-pending">Inside Premises</span>
                                    )}
                                </td>
                                <td>
                                    {!v.checkOutTime && (
                                        <button onClick={() => handleCheckout(v._id)} style={{ color: 'var(--primary)', background: 'none', border: '1px solid var(--primary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                            <Clock size={14} /> Check Out
                                        </button>
                                    )}
                                    {v.checkOutTime && (
                                        <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={16} /> Completed
                                        </div>
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

export default Visitors;

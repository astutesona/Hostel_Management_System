import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IndianRupee, PieChart, Users, AlertCircle } from 'lucide-react';

const Fees = () => {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ totalExpected: 0, totalCollected: 0, totalPending: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/students');
            const data = res.data;
            setStudents(data);

            const collected = data.reduce((acc, s) => acc + (s.fees.paid || 0), 0);
            const expected = data.reduce((acc, s) => acc + (s.fees.total || 0), 0);
            
            setStats({
                totalExpected: expected,
                totalCollected: collected,
                totalPending: expected - collected
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateFee = async (id) => {
        const amount = prompt('Enter amount paid:');
        if (amount && !isNaN(amount)) {
            try {
                await api.patch(`/updateFee/${id}`, { paidAmount: amount });
                fetchData();
            } catch (err) {
                alert('Error updating fee: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    return (
        <div>
            <h1>Fee Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ borderLeft: '5px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Total Expected</p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{stats.totalExpected.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)' }}>
                            <PieChart color="#6366f1" size={24} />
                        </div>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Total Collected</p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{stats.totalCollected.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255, 107, 0, 0.1)' }}>
                            <IndianRupee color="var(--primary)" size={24} />
                        </div>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Total Pending</p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{stats.totalPending.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)' }}>
                            <AlertCircle color="var(--danger)" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3>Pending Fee Records</h3>
                    <div className="badge badge-pending" style={{ padding: '0.5rem 1rem' }}>
                        {students.filter(s => s.fees.status !== 'Paid').length} STUDENTS PENDING
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Total Fee</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => {
                            const balance = s.fees.total - s.fees.paid;
                            const percent = (s.fees.paid / s.fees.total) * 100;
                            
                            return (
                                <tr key={s._id}>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{s.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.room}</div>
                                    </td>
                                    <td><span style={{ fontWeight: 600 }}>₹{s.fees.total}</span></td>
                                    <td>₹{s.fees.paid}</td>
                                    <td style={{ color: balance > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>₹{balance}</td>
                                    <td style={{ width: '180px' }}>
                                        <div style={{ background: 'rgba(0,0,0,0.1)', height: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                            <div style={{ width: `${percent}%`, background: 'var(--primary)', height: '100%' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                            {percent.toFixed(1)}% PAID
                                        </span>
                                    </td>
                                    <td>
                                        {balance > 0 ? (
                                            <button onClick={() => handleUpdateFee(s._id)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                                Record Payment
                                            </button>
                                        ) : (
                                            <span className="badge badge-success">FULLY PAID</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Fees;

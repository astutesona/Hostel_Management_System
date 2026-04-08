import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LayoutDashboard, Users, DoorOpen, AlertCircle, IndianRupee } from 'lucide-react';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [students, roomsRes, complaints] = await Promise.all([
                api.get('/students'),
                api.get('/rooms'),
                api.get('/complaints')
            ]);
            
            const revenue = students.data.reduce((acc, s) => acc + (s.fees.paid || 0), 0);

            setStats({
                students: students.data.length,
                rooms: roomsRes.data.length,
                complaints: complaints.data.filter(c => c.status === 'Pending').length,
                revenue: revenue
            });
            setRooms(roomsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const cards = [
        { title: 'Total Students', value: stats.students, icon: <Users color="#6366f1" />, bg: '#eef2ff' },
        { title: 'Total Rooms', value: stats.rooms, icon: <DoorOpen color="#10b981" />, bg: '#ecfdf5' },
        { title: 'Pending Complaints', value: stats.complaints, icon: <AlertCircle color="#f43f5e" />, bg: '#fff1f2' },
        { title: 'Total Revenue', value: '₹' + (stats.revenue || 0).toLocaleString(), icon: <IndianRupee color="#f97316" />, bg: '#fff7ed' }
    ];

    return (
        <div>
            <h1>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                {cards.map((card, idx) => (
                    <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: card.bg }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{card.title}</p>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
                <div>
                    <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-light) 100%)', border: '1px solid var(--primary)', opacity: 0.9 }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>Hostel Management Command Center</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            Welcome to your modernized administration hub. This platform simplifies your daily operations—from seamless student boarding and room allocation to real-time revenue analytics and complaint resolution. 
                        </p>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.5 }}>● SYSTEM ONLINE</div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#10b981' }}>● DATABASE SYNCED</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Room Occupancy</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {rooms.map(room => (
                            <div 
                                key={room._id} 
                                title={`Room ${room.roomNo}: ${room.occupied}/${room.capacity}`}
                                style={{ 
                                    height: '40px', 
                                    borderRadius: '6px', 
                                    backgroundColor: room.occupied >= room.capacity ? '#ef4444' : '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {room.roomNo}
                            </div>
                        ))}
                    </div>
                    {rooms.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No rooms added yet.</p>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '2px' }}></div> Available</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div> Full</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

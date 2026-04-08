import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Coffee, Edit3 } from 'lucide-react';

const Meals = () => {
    const [menu, setMenu] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [formData, setFormData] = useState({ breakfast: '', lunch: '', snacks: '', dinner: '' });
    const [loading, setLoading] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await api.get('/menu');
            setMenu(res.data);
        } catch (err) {
            console.error('Error fetching menu:', err);
        }
    };

    const getMenuForDay = (day) => {
        return menu.find(m => m.day === day) || { breakfast: '-', lunch: '-', snacks: '-', dinner: '-' };
    };

    const handleEditClick = (dayStr) => {
        setEditMode(dayStr);
        const dayMenu = getMenuForDay(dayStr);
        setFormData({ 
            breakfast: dayMenu.breakfast !== '-' ? dayMenu.breakfast : '', 
            lunch: dayMenu.lunch !== '-' ? dayMenu.lunch : '', 
            snacks: dayMenu.snacks !== '-' ? dayMenu.snacks : '', 
            dinner: dayMenu.dinner !== '-' ? dayMenu.dinner : '' 
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/updateMenu/${editMode}`, formData);
            setEditMode(null);
            fetchMenu();
        } catch (err) {
            console.error('Failed to update menu:', err);
            alert('Failed to update menu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Coffee color="var(--primary)" size={28} />
                <h1 style={{ margin: 0 }}>Mess Menu Scheduler</h1>
            </div>

            {editMode && (
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Editing Menu: {editMode}</h3>
                        <button onClick={() => setEditMode(null)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>Close</button>
                    </div>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                        <div><label>Breakfast</label><input type="text" value={formData.breakfast} onChange={(e) => setFormData({...formData, breakfast: e.target.value})} /></div>
                        <div><label>Lunch</label><input type="text" value={formData.lunch} onChange={(e) => setFormData({...formData, lunch: e.target.value})} /></div>
                        <div><label>Snacks</label><input type="text" value={formData.snacks} onChange={(e) => setFormData({...formData, snacks: e.target.value})} /></div>
                        <div><label>Dinner</label><input type="text" value={formData.dinner} onChange={(e) => setFormData({...formData, dinner: e.target.value})} /></div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ height: '45px', marginBottom: '1.25rem' }}>Save</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {daysOfWeek.map(day => {
                    const dayMenu = getMenuForDay(day);
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                    return (
                        <div key={day} className="card" style={{ position: 'relative', border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)', padding: '1.5rem', marginBottom: '0' }}>
                            {isToday && <span style={{ position: 'absolute', top: '-10px', right: '15px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>TODAY</span>}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0 }}>{day}</h3>
                                <button onClick={() => handleEditClick(day)} style={{ background: 'transparent', padding: '5px', color: 'var(--text-muted)' }} title="Edit Menu"><Edit3 size={16} /></button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Breakfast</strong><div style={{ fontWeight: 600 }}>{dayMenu.breakfast}</div></div>
                                <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lunch</strong><div style={{ fontWeight: 600 }}>{dayMenu.lunch}</div></div>
                                <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Snacks</strong><div style={{ fontWeight: 600 }}>{dayMenu.snacks}</div></div>
                                <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dinner</strong><div style={{ fontWeight: 600 }}>{dayMenu.dinner}</div></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Meals;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Megaphone, Plus } from 'lucide-react';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/notices');
            setNotices(res.data);
        } catch (err) {
            console.error('Error fetching notices:', err);
        }
    };

    const handleAddNotice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/addNotice', newNotice);
            setNewNotice({ title: '', content: '' });
            fetchNotices();
        } catch (err) {
            console.error('Failed to add notice:', err);
            alert('Failed to add notice');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notice?')) return;
        try {
            await api.delete(`/deleteNotice/${id}`);
            fetchNotices();
        } catch (err) {
            console.error('Failed to delete notice:', err);
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Megaphone color="var(--primary)" size={28} />
                <h1 style={{ margin: 0 }}>Notice Board</h1>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: '1 1 300px', alignSelf: 'flex-start' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} color="var(--primary)" /> 
                        Post New Notice
                    </h3>
                    <form onSubmit={handleAddNotice}>
                        <label>Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Mandatory Meeting" 
                            value={newNotice.title} 
                            onChange={(e) => setNewNotice({...newNotice, title: e.target.value})} 
                            required 
                        />

                        <label>Announcement Content</label>
                        <textarea 
                            rows="4" 
                            placeholder="Write the details here..." 
                            value={newNotice.content} 
                            onChange={(e) => setNewNotice({...newNotice, content: e.target.value})} 
                            required 
                        ></textarea>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? 'Posting...' : 'Publish Notice'}
                        </button>
                    </form>
                </div>

                <div className="card" style={{ flex: '2 1 500px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Announcements</h3>
                    {notices.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No notices posted yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {notices.map(notice => (
                                <div key={notice._id} style={{ 
                                    padding: '1.25rem', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '12px',
                                    background: 'var(--bg-light)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{notice.title}</h4>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                                {new Date(notice.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                            {notice.content}
                                        </p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => handleDelete(notice._id)}
                                        style={{ background: 'transparent', padding: '0.5rem', color: 'var(--danger)', boxShadow: 'none' }}
                                        title="Delete notice"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notices;

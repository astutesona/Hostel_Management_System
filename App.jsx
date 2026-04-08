import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Complaints from './pages/Complaints';
import Fees from './pages/Fees';
import Notices from './pages/Notices';
import Visitors from './pages/Visitors';
import Meals from './pages/Meals';
import StaffPanel from './pages/StaffPanel';
import Leaves from './pages/Leaves';
import Login from './pages/Login';

import api from './services/api';

// Import CSS
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.get('/me');
          setAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  if (loading) return null; // Or a loading spinner

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        {!authenticated ? (
          <Routes>
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <>
            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="main-content">
              <div className="marquee-wrapper">
                <div className="marquee-label">Daily Motivation</div>
                <div className="marquee-content">
                  <div className="app-marquee">
                    "Between hostel walls, you learn independence; at home, you feel love."
                  </div>
                </div>
              </div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/visitors" element={<Visitors />} />
                <Route path="/meals" element={<Meals />} />
                <Route path="/staff" element={<StaffPanel />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Footer darkMode={darkMode} />
            </main>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;

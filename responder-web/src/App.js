import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import ResponderDashboard from './components/ResponderDashboard';
import Registration from './components/Registration';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>🚑 Emergency Healthcare</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.first_name} ({user.user_type})</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </header>

        <main className="app-main">
          <Routes>
            <Route 
              path="/login" 
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !user ? (
                  <Registration onRegister={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  user.user_type === 'patient' ? 
                    <PatientDashboard user={user} onLogout={handleLogout} /> : 
                    <ResponderDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import ResponderDashboard from './components/ResponderDashboard';
import Registration from './components/Registration';

function App() {
  const [user, setUser] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    // If demo user data is passed directly (object), use it
    if (typeof email === 'object') {
      const userData = email;
      setUser(userData);
      localStorage.setItem('token', userData.access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login with:', email);
      
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setUser(data);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userData', JSON.stringify(data));
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert(errorData.detail || 'Login failed. Use demo buttons for quick access.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Backend not reachable. Using demo mode instead.');
      
      // Fallback to demo data
      const demoUser = email.includes('patient') ? {
        id: 1,
        user_id: 1,
        first_name: 'Demo',
        last_name: 'Patient',
        email: email,
        user_type: 'patient',
        access_token: 'demo-token',
        token_type: 'bearer'
      } : {
        id: 2,
        user_id: 2,
        first_name: 'Demo',
        last_name: 'Responder',
        email: email,
        user_type: 'responder', 
        access_token: 'demo-token',
        token_type: 'bearer'
      };
      
      setUser(demoUser);
      localStorage.setItem('token', demoUser.access_token);
      localStorage.setItem('userData', JSON.stringify(demoUser));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      console.log('Attempting registration:', userData);
      
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        setUser(data);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userData', JSON.stringify(data));
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        alert(errorData.detail || 'Registration failed. Please try different credentials.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Backend not reachable. Please use demo buttons for now.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  const switchToRegister = () => {
    setShowRegistration(true);
  };

  const switchToLogin = () => {
    setShowRegistration(false);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Emergency Response System...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {!user ? (
        // Show login/registration when no user is logged in
        showRegistration ? (
          <Registration 
            onRegister={handleRegister}
            switchToLogin={switchToLogin}
          />
        ) : (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={switchToRegister}
            loading={loading}
          />
        )
      ) : (
        // Show appropriate dashboard based on user type
        user.user_type === 'patient' ? (
          <PatientDashboard 
            user={user}
            onLogout={handleLogout}
          />
        ) : (
          <ResponderDashboard 
            user={user}
            onLogout={handleLogout}
          />
        )
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    userType: 'patient' // 'patient' or 'responder'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let userData;
    
    if (credentials.userType === 'patient') {
      userData = {
        id: 1,
        name: 'Alex Patient',
        email: credentials.email,
        user_type: 'patient',
        medical_info: {
          blood_type: 'O+',
          allergies: ['Penicillin', 'Peanuts'],
          conditions: ['Asthma'],
          medications: ['Ventolin']
        }
      };
    } else {
      userData = {
        id: 2,
        name: 'Sarah Responder',
        email: credentials.email,
        user_type: 'responder',
        badgeNumber: 'RES123',
        organization: 'City Hospital'
      };
    }
    
    onLogin(userData);
  };

  return (
    <div className="login-container">
      <h2>Emergency Healthcare Login</h2>
      
      <div className="user-type-selector">
        <button
          type="button"
          className={`type-btn ${credentials.userType === 'patient' ? 'active' : ''}`}
          onClick={() => setCredentials({...credentials, userType: 'patient'})}
        >
          👤 Patient
        </button>
        <button
          type="button"
          className={`type-btn ${credentials.userType === 'responder' ? 'active' : ''}`}
          onClick={() => setCredentials({...credentials, userType: 'responder'})}
        >
          🚑 Responder
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />

        <button type="submit" className="login-btn">
          Login as {credentials.userType === 'patient' ? 'Patient' : 'Responder'}
        </button>
      </form>
      
      <div className="demo-credentials">
        <p><strong>Demo:</strong> Use any email/password</p>
        <p>Select user type to see different interfaces</p>
      </div>
    </div>
  );
};

export default Login;

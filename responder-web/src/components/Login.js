import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    badgeNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mock login - in real app, verify with backend
    const mockResponder = {
      id: 1,
      name: 'John Responder',
      badgeNumber: credentials.badgeNumber,
      organization: 'City Hospital'
    };
    
    onLogin(mockResponder);
  };

  return (
    <div className="login-container">
      <h2>Responder Login</h2>
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
        <input
          type="text"
          placeholder="Badge Number"
          value={credentials.badgeNumber}
          onChange={(e) => setCredentials({...credentials, badgeNumber: e.target.value})}
          required
        />
        <button type="submit">Login</button>
      </form>
      
      <div className="demo-credentials">
        <p><strong>Demo:</strong> Use any credentials</p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import './Registration.css';

const Registration = ({ onRegister, switchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    user_type: 'patient'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name) newErrors.first_name = ' Please enter your first name';
    if (!formData.last_name) newErrors.last_name = ' Please enter your last name';
    if (!formData.email) newErrors.email = ' Please enter your email';
    if (!formData.password) newErrors.password = ' Please create a password';
    if (formData.password.length < 6) newErrors.password = ' Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = ' Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { confirmPassword, ...registerData } = formData;
    onRegister(registerData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="registration-container">
      {/* Background Animation */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <div className="registration-card glass">
        <div className="registration-header">
          <div className="logo"></div>
          <h1>Join EmergencyCare</h1>
          <p className="tagline">Start your safety journey today! </p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <div className="section-header">
              <span className="emoji"></span>
              <h3>Personal Information</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={errors.first_name ? 'error' : ''}
                  />
                  {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={errors.last_name ? 'error' : ''}
                  />
                  {errors.last_name && <div className="error-message">{errors.last_name}</div>}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <div className="input-icon"></div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <span className="emoji"></span>
              <h3>Account Type</h3>
            </div>
            
            <div className="account-type-selector">
              <label className={`type-option ${formData.user_type === 'patient' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="user_type"
                  value="patient"
                  checked={formData.user_type === 'patient'}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <span className="emoji"></span>
                  <div className="option-text">
                    <div className="title">I Need Help</div>
                    <div className="description">Create emergency QR codes with your medical data</div>
                  </div>
                </div>
              </label>
              
              <label className={`type-option ${formData.user_type === 'responder' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="user_type"
                  value="responder"
                  checked={formData.user_type === 'responder'}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <span className="emoji"></span>
                  <div className="option-text">
                    <div className="title">I'm a Responder</div>
                    <div className="description">Access emergency medical information quickly</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <span className="emoji"></span>
              <h3>Security</h3>
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <div className="input-wrapper">
                <div className="input-icon"></div>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <div className="input-wrapper">
                  <div className="input-icon"></div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="input-wrapper">
                  <div className="input-icon"></div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn">
            <span className="emoji"></span>
            <span>Create My Safety Account</span>
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <span className="switch-link" onClick={switchToLogin}>
              Welcome back! Login here 
            </span>
          </p>
        </div>

        <div className="security-features">
          <div className="feature">
            <span className="emoji"></span>
            <span>Bank-level encryption</span>
          </div>
          <div className="feature">
            <span className="emoji"></span>
            <span>Instant emergency response</span>
          </div>
          <div className="feature">
            <span className="emoji"></span>
            <span>Your safety comes first</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

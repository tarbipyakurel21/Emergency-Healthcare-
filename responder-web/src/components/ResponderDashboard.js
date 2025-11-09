import React, { useState } from 'react';
import QRScanner from './QRScanner';
import './ResponderDashboard.css';

const ResponderDashboard = ({ user, onLogout }) => {
  const [emergencyData, setEmergencyData] = useState(null);

  const handleQRScan = (data) => {
    console.log('QR Scan Data:', data);
    setEmergencyData(data);
  };

  const handleBackToScanner = () => {
    setEmergencyData(null);
  };

  const handleContactPatient = () => {
    if (emergencyData?.medical_summary?.emergency_contact?.phone) {
      window.open(`tel:${emergencyData.medical_summary.emergency_contact.phone}`);
    } else {
      alert('No contact number available');
    }
  };

  return (
    <div className="responder-dashboard">
      <div className="dashboard-header">
        <h1>🚑 Emergency Responder</h1>
        <div className="user-info">
          <span>Welcome, {user.first_name} ({user.organization})</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {!emergencyData ? (
        <div className="scanner-section">
          <QRScanner onScan={handleQRScan} />
        </div>
      ) : (
        <div className="emergency-details-section">
          <div className="emergency-header">
            <h2>🚨 EMERGENCY RESPONSE REQUIRED</h2>
            <button onClick={handleBackToScanner} className="back-btn">
              ← Back to Scanner
            </button>
          </div>

          <div className="emergency-info">
            <div className="info-card critical">
              <h3>🚑 Critical Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Blood Type:</label>
                  <span className="critical-value">{emergencyData.medical_summary?.blood_type || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <label>Allergies:</label>
                  <span>{emergencyData.medical_summary?.allergies?.join(', ') || 'None known'}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>📋 Medical Conditions</h3>
              <ul>
                {emergencyData.medical_summary?.conditions?.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
                {(!emergencyData.medical_summary?.conditions || emergencyData.medical_summary.conditions.length === 0) && (
                  <li>No known conditions</li>
                )}
              </ul>
            </div>

            <div className="info-card">
              <h3>💊 Current Medications</h3>
              <ul>
                {emergencyData.medical_summary?.medications?.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
                {(!emergencyData.medical_summary?.medications || emergencyData.medical_summary.medications.length === 0) && (
                  <li>No current medications</li>
                )}
              </ul>
            </div>

            <div className="info-card">
              <h3>📞 Emergency Contact</h3>
              {emergencyData.medical_summary?.emergency_contact ? (
                <div className="contact-info">
                  <p><strong>Name:</strong> {emergencyData.medical_summary.emergency_contact.name}</p>
                  <p><strong>Phone:</strong> {emergencyData.medical_summary.emergency_contact.phone}</p>
                  <p><strong>Relationship:</strong> {emergencyData.medical_summary.emergency_contact.relationship}</p>
                </div>
              ) : (
                <p>No emergency contact provided</p>
              )}
            </div>

            <div className="info-card">
              <h3>📍 Emergency Location</h3>
              <p>{emergencyData.location?.address || 'Location data'}</p>
              <p>Coordinates: {emergencyData.location?.lat}, {emergencyData.location?.lng}</p>
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${emergencyData.location?.lat},${emergencyData.location?.lng}`, '_blank')}
                className="navigate-btn"
              >
                🗺️ Navigate to Location
              </button>
            </div>

            <div className="action-buttons">
              <button className="action-btn primary" onClick={handleContactPatient}>
                📞 Contact Patient
              </button>
              <button className="action-btn secondary">
                🏥 Transport to Hospital
              </button>
              <button className="action-btn success" onClick={handleBackToScanner}>
                ✅ Emergency Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponderDashboard;
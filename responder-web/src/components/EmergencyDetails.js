import React from 'react';
import './EmergencyDetails.css';

const EmergencyDetails = ({ data, onBack }) => {
  if (!data) {
    return (
      <div className="emergency-details">
        <h2>No Emergency Data</h2>
        <button onClick={onBack}>Back to Scanner</button>
      </div>
    );
  }

  const { medical_summary, location, emergency_id, timestamp } = data;

  return (
    <div className="emergency-details">
      <div className="emergency-header">
        <h2>🚨 EMERGENCY ALERT</h2>
        <p className="emergency-id">ID: {emergency_id}</p>
        <p className="timestamp">{new Date(timestamp).toLocaleString()}</p>
      </div>

      <div className="critical-info">
        <h3>🚑 Critical Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Blood Type:</label>
            <span className="critical-value">{medical_summary.blood_type || 'Unknown'}</span>
          </div>
          <div className="info-item">
            <label>Allergies:</label>
            <span>{medical_summary.allergies?.join(', ') || 'None known'}</span>
          </div>
        </div>
      </div>

      <div className="medical-section">
        <h3>📋 Medical Conditions</h3>
        <ul>
          {medical_summary.conditions?.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
          {(!medical_summary.conditions || medical_summary.conditions.length === 0) && (
            <li>No known conditions</li>
          )}
        </ul>
      </div>

      <div className="medications-section">
        <h3>💊 Current Medications</h3>
        <ul>
          {medical_summary.medications?.map((med, index) => (
            <li key={index}>{med}</li>
          ))}
          {(!medical_summary.medications || medical_summary.medications.length === 0) && (
            <li>No current medications</li>
          )}
        </ul>
      </div>

      <div className="contact-section">
        <h3>📞 Emergency Contact</h3>
        {medical_summary.emergency_contact ? (
          <div className="contact-info">
            <p><strong>Name:</strong> {medical_summary.emergency_contact.name}</p>
            <p><strong>Phone:</strong> {medical_summary.emergency_contact.phone}</p>
            <p><strong>Relationship:</strong> {medical_summary.emergency_contact.relationship}</p>
          </div>
        ) : (
          <p>No emergency contact provided</p>
        )}
      </div>

      <div className="location-section">
        <h3>📍 Emergency Location</h3>
        <p>{location.address || 'Location data'}</p>
        <p>Coordinates: {location.lat}, {location.lng}</p>
      </div>

      <div className="action-buttons">
        <button onClick={onBack} className="back-btn">
          🔄 Scan Another Code
        </button>
        <button 
          onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank')}
          className="navigate-btn"
        >
          🗺️ Navigate to Location
        </button>
      </div>
    </div>
  );
};

export default EmergencyDetails;

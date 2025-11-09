import React, { useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './PatientDashboard.css';
import Chatbot from './Chatbot';

const PatientDashboard = ({ user, onLogout }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [location, setLocation] = useState(null);
  const [emergencyId, setEmergencyId] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);

  const generateQRCode = (emergencyData) => {
    const qrData = JSON.stringify({
      emergency_id: emergencyData.emergency_id,
      user_id: emergencyData.user_id,
      timestamp: emergencyData.timestamp,
      location: emergencyData.location,
      medical_summary: emergencyData.medical_summary,
    });

    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'svg',
      data: qrData,
      dotsOptions: { color: '#d32f2f', type: 'rounded' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#d32f2f' },
      cornersDotOptions: { type: 'dot', color: '#d32f2f' },
    });

    return qrCode;
  };

  const triggerEmergency = async () => {
    const userLocation = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.01,
      lng: -74.0060 + (Math.random() - 0.5) * 0.01,
      address: 'New York, NY (Simulated Location)',
    };

    setLocation(userLocation);
    const newEmergencyId =
      'EMG' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
    setEmergencyId(newEmergencyId);

    const emergencyData = {
      emergency_id: newEmergencyId,
      user_id: user.id,
      timestamp: new Date().toISOString(),
      location: userLocation,
      medical_summary: user.medical_info,
    };

    setTimeout(() => {
      const qrCodeInstance = generateQRCode(emergencyData);
      qrCodeInstance.getRawData('svg').then((data) => {
        const url = URL.createObjectURL(data);
        setQrCode(url);
      });
      setEmergencyActive(true);
    }, 1000);
  };

  const resolveEmergency = () => {
    setEmergencyActive(false);
    setQrCode(null);
    setEmergencyId('');
    setLocation(null);
  };

  const shareLocation = () => {
    alert(
      `📍 Location shared with responders!\nCoordinates: ${location?.lat.toFixed(
        6
      )}, ${location?.lng.toFixed(6)}`
    );
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `emergency-qr-${emergencyId}.svg`;
      link.click();
    }
  };

  return (
    <div className="patient-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🚨 Emergency Dashboard</h1>
        </div>
        <div className="header-right">
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="chatbot-btn"
          >
            🤖 Talk to Your AI Buddy Chris
          </button>
         
        </div>
      </div>

      {/* Main Content */}
      {!emergencyActive ? (
        <div className="pre-emergency">
          <div className="emergency-card">
            <div className="icon">🚨</div>
            <h2>Emergency Assistance</h2>
            <p>Trigger emergency mode to alert responders and share your info.</p>
            <button onClick={triggerEmergency} className="trigger-btn">
              🚨 TRIGGER EMERGENCY
            </button>
          </div>

          <div className="medical-summary">
            <h3>🩸 Medical Information</h3>
            <div className="summary-grid">
              <div>
                <strong>Blood Type:</strong> {user.medical_info.blood_type}
              </div>
              <div>
                <strong>Allergies:</strong>{' '}
                {user.medical_info.allergies.join(', ') || 'None'}
              </div>
              <div>
                <strong>Conditions:</strong>{' '}
                {user.medical_info.conditions.join(', ') || 'None'}
              </div>
              <div>
                <strong>Medications:</strong>{' '}
                {user.medical_info.medications.join(', ') || 'None'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="emergency-details">
          <div className="emergency-header">
            <h2>🚨 EMERGENCY ACTIVE</h2>
            <p className="emergency-id">ID: {emergencyId}</p>
          </div>

          {location && (
            <>
              <p>
                <strong>Location:</strong> {location.address}
              </p>
              <p>
                <strong>Coordinates:</strong>{' '}
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </>
          )}

          {qrCode && (
            <div className="qr-section">
              <h3>Emergency QR Code</h3>
              <img src={qrCode} alt="Emergency QR" className="qr-img" />
              <button onClick={downloadQRCode} className="download-btn">
                📥 Download QR
              </button>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={shareLocation} className="share-btn">
              📍 Update Location
            </button>
            <button onClick={resolveEmergency} className="resolve-btn">
              ✅ Resolve Emergency
            </button>
          </div>
        </div>
      )}

      {/* Floating Chatbot */}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
};

export default PatientDashboard;

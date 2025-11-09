import React, { useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './PatientDashboard.css';

const PatientDashboard = ({ user, onLogout }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [location, setLocation] = useState(null);
  const [emergencyId, setEmergencyId] = useState('');
  const qrRef = useRef(null);

  const generateQRCode = (emergencyData) => {
    // Create QR code data that responders can scan
    const qrData = JSON.stringify({
      emergency_id: emergencyData.emergency_id,
      user_id: emergencyData.user_id,
      timestamp: emergencyData.timestamp,
      location: emergencyData.location,
      medical_summary: emergencyData.medical_summary
    });

    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "svg",
      data: qrData,
      dotsOptions: {
        color: "#e74c3c",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#e74c3c"
      },
      cornersDotOptions: {
        type: "dot",
        color: "#e74c3c"
      }
    });

    return qrCode;
  };

  const triggerEmergency = async () => {
    try {
      // Get user's current location (simulated for demo)
      const userLocation = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.0060 + (Math.random() - 0.5) * 0.01,
        address: "New York, NY (Simulated Location)"
      };
      
      setLocation(userLocation);

      // Generate emergency ID
      const newEmergencyId = 'EMG' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
      setEmergencyId(newEmergencyId);

      // Create emergency data
      const emergencyData = {
        emergency_id: newEmergencyId,
        user_id: user.id,
        timestamp: new Date().toISOString(),
        location: userLocation,
        medical_summary: user.medical_info
      };

      // Generate real QR code
      setTimeout(() => {
        const qrCodeInstance = generateQRCode(emergencyData);
        
        // Get QR code as data URL
        qrCodeInstance.getRawData('svg').then((data) => {
          const url = URL.createObjectURL(data);
          setQrCode(url);
        });
        
        setEmergencyActive(true);
      }, 1000);

    } catch (error) {
      console.error('Error triggering emergency:', error);
      alert('Failed to trigger emergency. Please try again.');
    }
  };

  const resolveEmergency = () => {
    setEmergencyActive(false);
    setQrCode(null);
    setEmergencyId('');
    setLocation(null);
  };

  const shareLocation = () => {
    alert(`Location shared with emergency responders!\nCoordinates: ${location?.lat.toFixed(6)}, ${location?.lng.toFixed(6)}`);
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
      <div className="dashboard-header">
        <h1>🆘 Emergency Response</h1>
        <div className="user-info">
          <span className="welcome-message">Welcome, {user.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {!emergencyActive ? (
        <div className="pre-emergency">
          <div className="emergency-card">
            <div className="emergency-icon">🚨</div>
            <h2>Emergency Assistance</h2>
            <p>If you're in immediate danger or need medical assistance, trigger the emergency system.</p>
            
            <button onClick={triggerEmergency} className="emergency-trigger-btn">
              🚨 TRIGGER EMERGENCY
            </button>

            <div className="emergency-info">
              <h3>What happens when you trigger emergency:</h3>
              <ul>
                <li>📍 Your location is shared with responders</li>
                <li>🏥 Medical information becomes accessible</li>
                <li>📞 Emergency contacts are notified</li>
                <li>🔐 Secure QR code is generated for responders</li>
                <li>🚑 Nearest responders are dispatched</li>
              </ul>
            </div>
          </div>

          <div className="medical-summary">
            <h3>Your Medical Information</h3>
            <div className="medical-grid">
              <div className="medical-item">
                <label>Blood Type:</label>
                <span className="medical-value">{user.medical_info.blood_type}</span>
              </div>
              <div className="medical-item">
                <label>Allergies:</label>
                <span className="medical-value">{user.medical_info.allergies.join(', ') || 'None known'}</span>
              </div>
              <div className="medical-item">
                <label>Conditions:</label>
                <span className="medical-value">{user.medical_info.conditions.join(', ') || 'None known'}</span>
              </div>
              <div className="medical-item">
                <label>Medications:</label>
                <span className="medical-value">{user.medical_info.medications.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="emergency-active">
          <div className="emergency-alert">
            <div className="alert-header">
              <div className="pulse-icon">🔴</div>
              <h2>EMERGENCY ACTIVE</h2>
              <div className="pulse-icon">🔴</div>
            </div>
            
            <p className="alert-message">Help is on the way! Show this QR code to emergency responders.</p>
            
            <div className="emergency-details">
              <div className="detail-item">
                <strong>Emergency ID:</strong> <span className="emergency-id">{emergencyId}</span>
              </div>
              <div className="detail-item">
                <strong>Location:</strong> {location?.address}
              </div>
              <div className="detail-item">
                <strong>Coordinates:</strong> {location?.lat?.toFixed(6)}, {location?.lng?.toFixed(6)}
              </div>
              <div className="detail-item">
                <strong>Time Activated:</strong> {new Date().toLocaleString()}
              </div>
            </div>

            {qrCode && (
              <div className="qr-code-section">
                <h3>Emergency QR Code</h3>
                <div className="qr-code-container">
                  <img src={qrCode} alt="Emergency QR Code" className="qr-code-image" />
                  <div className="qr-overlay">
                    <div className="qr-emergency-text">EMERGENCY</div>
                  </div>
                </div>
                <p className="qr-instructions">
                  <strong>Responders:</strong> Scan this QR code to access medical information and location
                </p>
                <button onClick={downloadQRCode} className="download-btn">
                  📥 Download QR Code
                </button>
              </div>
            )}

            <div className="emergency-actions">
              <button onClick={shareLocation} className="action-btn share-btn">
                📍 Update Location
              </button>
              <button onClick={resolveEmergency} className="action-btn resolve-btn">
                ✅ Emergency Resolved
              </button>
            </div>

            <div className="safety-tips">
              <h4>🚨 Safety Instructions:</h4>
              <ul>
                <li>🔒 Stay in a safe, visible location</li>
                <li>📱 Keep your phone accessible and charged</li>
                <li>👁️ Make yourself visible to arriving responders</li>
                <li>💊 Have medications and ID ready if possible</li>
                <li>📞 Be prepared to provide additional information</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;

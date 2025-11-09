import React, { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import "./ResponderDashboard.css";

const ResponderDashboard = ({ user, onLogout }) => {
  const [emergencyData, setEmergencyData] = useState(null);
  const [location, setLocation] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  // ✅ Get responder’s current location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Location access denied:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // ✅ When QR code is scanned
  const handleQRScan = (data) => {
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setEmergencyData(parsed);
      setScannerActive(false);
    } catch (e) {
      alert("Invalid or unreadable QR code");
      console.error("QR Parse Error:", e);
    }
  };

  // ✅ Return to scanner view
  const handleBackToScanner = () => {
    setEmergencyData(null);
    setScannerActive(true);
  };

  const handleContactPatient = () => {
    if (emergencyData?.medical_summary?.emergency_contact?.phone) {
      window.open(`tel:${emergencyData.medical_summary.emergency_contact.phone}`);
    } else {
      alert("No contact number available");
    }
  };

  return (
    <div className="responder-dashboard">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <h1>🚑 Emergency Responder Dashboard</h1>
        <div className="header-right">
          <span>
            {user.name} — <em>{user.organization}</em>
          </span>
         
        </div>
      </header>

      {/* ===== LOCATION STATUS ===== */}
      {location && (
        <div className="location-status">
          📍 Current Location:{" "}
          <strong>
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </strong>
        </div>
      )}

      {/* ===== SCANNER VIEW ===== */}
      {scannerActive && !emergencyData && (
        <div className="scanner-wrapper">
          <h2>🔍 Scan Patient Emergency QR</h2>
          <p className="hint">
            Align the patient’s QR code within the camera frame.
          </p>
          <QRScanner onScan={handleQRScan} />
        </div>
      )}

      {/* ===== EMERGENCY DETAILS ===== */}
      {emergencyData && (
        <div className="emergency-section">
          <div className="emergency-header">
            <h2>🚨 Emergency Case Detected</h2>
            <button className="back-btn" onClick={handleBackToScanner}>
              ← Back to Scanner
            </button>
          </div>

          <div className="emergency-grid">
            <div className="info-card critical">
              <h3>🩸 Vital Info</h3>
              <p><strong>Blood Type:</strong> {emergencyData.medical_summary?.blood_type}</p>
              <p>
                <strong>Allergies:</strong>{" "}
                {emergencyData.medical_summary?.allergies?.join(", ") || "None"}
              </p>
            </div>

            <div className="info-card">
              <h3>📋 Conditions</h3>
              <ul>
                {emergencyData.medical_summary?.conditions?.length
                  ? emergencyData.medical_summary.conditions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))
                  : "None"}
              </ul>
            </div>

            <div className="info-card">
              <h3>💊 Medications</h3>
              <ul>
                {emergencyData.medical_summary?.medications?.length
                  ? emergencyData.medical_summary.medications.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))
                  : "None"}
              </ul>
            </div>

            <div className="info-card">
              <h3>📞 Emergency Contact</h3>
              {emergencyData.medical_summary?.emergency_contact ? (
                <>
                  <p>
                    <strong>Name:</strong>{" "}
                    {emergencyData.medical_summary.emergency_contact.name}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {emergencyData.medical_summary.emergency_contact.phone}
                  </p>
                  <p>
                    <strong>Relation:</strong>{" "}
                    {emergencyData.medical_summary.emergency_contact.relationship}
                  </p>
                </>
              ) : (
                <p>No contact info available</p>
              )}
            </div>

            <div className="info-card">
              <h3>📍 Incident Location</h3>
              <p>{emergencyData.location?.address}</p>
              <p>
                {emergencyData.location?.lat}, {emergencyData.location?.lng}
              </p>
              <button
                className="navigate-btn"
                onClick={() =>
                  window.open(
                    `https://maps.google.com/?q=${emergencyData.location?.lat},${emergencyData.location?.lng}`,
                    "_blank"
                  )
                }
              >
                🗺️ Open in Maps
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn red" onClick={handleContactPatient}>
              📞 Contact Patient
            </button>
            <button className="action-btn blue">🏥 Transport to Hospital</button>
            <button className="action-btn green" onClick={handleBackToScanner}>
              ✅ Mark Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponderDashboard;

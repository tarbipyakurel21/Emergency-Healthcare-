import React, { useRef, useEffect, useState } from 'react';
import './QRScanner.css';

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = async () => {
    try {
      // Check if we're on mobile and camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('📱 Camera not supported in this browser. Try Chrome or Safari.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Video play error:', e));
        setScanning(true);
        setCameraStarted(true);
        setError('');
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('📷 Camera permission denied. Please allow camera access in browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('❌ No camera found on this device.');
      } else {
        setError('❌ Camera error: ' + err.message);
      }
    }
  };

  const simulateQRScan = async () => {
    setError(''); // Clear previous errors
    
    try {
      // Use relative URL - let the browser handle the host
      const backendUrl = '';
      
      console.log('Testing backend connection...');
      
      // First test if backend is reachable
      const healthResponse = await fetch('/health');
      if (!healthResponse.ok) {
        throw new Error('Backend not reachable. Make sure it\'s running on port 8000.');
      }

      // Generate demo QR data directly (no backend call for now)
      const demoEmergencyData = {
        emergency_id: "DEMO123",
        user_id: 999,
        timestamp: new Date().toISOString(),
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: "New York, NY, USA"
        },
        medical_summary: {
          blood_type: "O+",
          allergies: ["Penicillin", "Peanuts", "Shellfish"],
          conditions: ["Asthma", "Hypertension", "Type 2 Diabetes"],
          medications: ["Ventolin", "Lisinopril", "Metformin"],
          emergency_contact: {
            name: "Jane Smith",
            phone: "+1-555-0123",
            relationship: "Spouse"
          }
        }
      };

      // Simulate successful scan
      setTimeout(() => {
        onScan(demoEmergencyData);
      }, 500);
      
    } catch (error) {
      console.error('Scan error:', error);
      setError('🔧 Backend connection failed. Using demo data instead. Error: ' + error.message);
      
      // Fallback: Use hardcoded demo data
      const demoEmergencyData = {
        emergency_id: "DEMO123",
        user_id: 999,
        timestamp: new Date().toISOString(),
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: "New York, NY, USA"
        },
        medical_summary: {
          blood_type: "O+",
          allergies: ["Penicillin", "Peanuts", "Shellfish"],
          conditions: ["Asthma", "Hypertension", "Type 2 Diabetes"],
          medications: ["Ventolin", "Lisinopril", "Metformin"],
          emergency_contact: {
            name: "Jane Smith",
            phone: "+1-555-0123",
            relationship: "Spouse"
          }
        }
      };
      
      // Show demo data after a short delay
      setTimeout(() => {
        onScan(demoEmergencyData);
      }, 1000);
    }
  };

  useEffect(() => {
    // Don't auto-start camera on mobile (let user trigger it)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Only auto-start if not on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        startCamera();
      } else {
        setError('📱 On mobile? Click "Start Camera" below and allow permissions.');
      }
    } else {
      setError('📷 Camera API not supported in this browser.');
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="scanner-container">
      <h2>Scan Emergency QR Code</h2>
      
      <div className="camera-container">
        {cameraStarted ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-preview"
          />
        ) : (
          <div className="camera-placeholder">
            <div className="placeholder-icon">📷</div>
            <p>{error ? 'Camera Not Available' : 'Camera Ready'}</p>
            {error && <p className="error-text">{error}</p>}
            {!cameraStarted && (
              <button onClick={startCamera} className="control-btn">
                Start Camera
              </button>
            )}
          </div>
        )}
        {cameraStarted && (
          <div className="scanner-overlay">
            <div className="scan-frame"></div>
          </div>
        )}
      </div>

      {error && !error.includes('On mobile?') && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="scanner-controls">
        {!cameraStarted && (
          <button onClick={startCamera} className="control-btn">
            📷 Start Camera
          </button>
        )}
        
        <button onClick={simulateQRScan} className="control-btn simulate-btn">
          🔍 Simulate Emergency Scan
        </button>
      </div>

      <div className="scanner-instructions">
        <h4>Mobile Camera Fix:</h4>
        <p>1. <strong>Use Chrome or Safari</strong> (not incognito)</p>
        <p>2. <strong>Allow camera permissions</strong> when prompted</p>
        <p>3. <strong>Click "Start Camera"</strong> if not auto-started</p>
        <p>4. Or use <strong>"Simulate Emergency Scan"</strong> to test without camera</p>
        
        <div className="mobile-tips">
          <h5>📱 iPhone Specific:</h5>
          <p>• Go to <strong>Settings → Safari → Camera</strong> → Allow</p>
          <p>• Make sure you're <strong>not in private browsing</strong></p>
          <p>• Try <strong>Chrome browser</strong> if Safari doesn't work</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;

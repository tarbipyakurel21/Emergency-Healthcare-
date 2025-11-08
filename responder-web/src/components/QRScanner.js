import React, { useRef, useEffect, useState } from 'react';
import './QRScanner.css';

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      setScanning(true);
      setError('');
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const simulateQRScan = async () => {
    // For demo purposes - simulate scanning a QR code
    try {
      // Use your computer's IP address for phone access
      const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : 'http://10.49.161.208:8000';
      
      console.log('Attempting to connect to:', backendUrl);
      
      const response = await fetch(backendUrl + '/demo/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Use the encrypted data from the backend
        const encryptedData = data.encrypted_data;
        
        // Send to backend for scanning
        const scanResponse = await fetch(backendUrl + '/demo/scan-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            encrypted_data: encryptedData
          }),
        });

        const scanResult = await scanResponse.json();
        
        if (scanResult.success) {
          onScan(scanResult.emergency_data);
        } else {
          setError('Scan failed: ' + scanResult.error);
        }
      }
    } catch (error) {
      setError('Demo scan failed: ' + error.message + '. Make sure backend is running on 10.49.161.208:8000');
    }
  };

  useEffect(() => {
    startCamera();
    
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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="camera-preview"
        />
        <div className="scanner-overlay">
          <div className="scan-frame"></div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="scanner-controls">
        <button onClick={startCamera} className="control-btn">
          🔄 Restart Camera
        </button>
        
        <button onClick={simulateQRScan} className="control-btn simulate-btn">
          🔍 Simulate QR Scan (Demo)
        </button>
      </div>

      <div className="scanner-instructions">
        <p>📱 <strong>Point camera at emergency QR code</strong></p>
        <p>💡 Ensure good lighting and steady hands</p>
        <p>🎯 Align QR code within the frame</p>
        <p>🔍 Use "Simulate QR Scan" to test without camera</p>
      </div>
    </div>
  );
};

export default QRScanner;

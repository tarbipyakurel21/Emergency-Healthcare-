import React, { useState, useRef } from 'react';
import './QRScanner.css';

const QRScanner = ({ onScan }) => {
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Method 1: Direct demo scan (no camera, no upload)
  const simulateQRScan = async () => {
    setError('');
    try {
      const demoEmergencyData = {
        emergency_id: "EMG20241108123045ABC123",
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

      // Simulate processing delay
      setTimeout(() => {
        onScan(demoEmergencyData);
      }, 800);
      
    } catch (error) {
      setError('Demo failed: ' + error.message);
    }
  };

  // Method 2: File upload for QR code photos
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    setSelectedImage(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      
      // Simulate QR code processing from the image
      setTimeout(() => {
        const demoEmergencyData = {
          emergency_id: "EMG20241108124530XYZ789",
          user_id: 456,
          timestamp: new Date().toISOString(),
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          location: {
            lat: 34.0522,
            lng: -118.2437,
            address: "Los Angeles, CA, USA"
          },
          medical_summary: {
            blood_type: "A-",
            allergies: ["Iodine", "Latex"],
            conditions: ["Epilepsy", "Migraine"],
            medications: ["Keppra", "Sumatriptan"],
            emergency_contact: {
              name: "Michael Johnson",
              phone: "+1-555-0456",
              relationship: "Brother"
            }
          }
        };
        onScan(demoEmergencyData);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  // Method 3: Take photo using native camera (works better on mobile)
  const takePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Method 4: Manual QR code input for testing
  const handleManualInput = () => {
    const qrData = prompt('Enter QR code data (for testing):', 'EMERGENCY:DEMO123:encrypted_data_here');
    if (qrData) {
      setError('Processing manual input...');
      setTimeout(() => {
        const demoEmergencyData = {
          emergency_id: "MANUAL123",
          user_id: 777,
          timestamp: new Date().toISOString(),
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          location: {
            lat: 41.8781,
            lng: -87.6298,
            address: "Chicago, IL, USA"
          },
          medical_summary: {
            blood_type: "B+",
            allergies: ["Sulfa drugs", "Bee stings"],
            conditions: ["Heart disease", "High cholesterol"],
            medications: ["Lipitor", "Aspirin"],
            emergency_contact: {
              name: "Sarah Wilson",
              phone: "+1-555-0789",
              relationship: "Daughter"
            }
          }
        };
        onScan(demoEmergencyData);
      }, 800);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="scanner-container">
      <h2>Emergency QR Code Scanner</h2>
      
      <div className="scanner-methods">
        
        {/* Method 1: Quick Demo */}
        <div className="method-card">
          <div className="method-icon">🚨</div>
          <h3>Quick Demo</h3>
          <p>Test with sample emergency data</p>
          <button onClick={simulateQRScan} className="method-btn demo-btn">
            Run Emergency Demo
          </button>
        </div>

        {/* Method 2: Photo Upload */}
        <div className="method-card">
          <div className="method-icon">📸</div>
          <h3>Upload QR Photo</h3>
          <p>Take a picture of QR code</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
          <button onClick={takePhoto} className="method-btn upload-btn">
            Take Photo of QR Code
          </button>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="QR code preview" />
              <button onClick={clearImage} className="clear-btn">×</button>
            </div>
          )}
        </div>

        {/* Method 3: Manual Input */}
        <div className="method-card">
          <div className="method-icon">⌨️</div>
          <h3>Manual Input</h3>
          <p>Enter QR data manually</p>
          <button onClick={handleManualInput} className="method-btn manual-btn">
            Enter QR Data
          </button>
        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="scanner-instructions">
        <h4>📱 Mobile Instructions:</h4>
        <p><strong>Option 1 (Recommended):</strong> Click "Take Photo of QR Code" - uses native camera</p>
        <p><strong>Option 2:</strong> Click "Run Emergency Demo" for instant testing</p>
        <p><strong>Option 3:</strong> Use "Enter QR Data" for developer testing</p>
      </div>

      <div className="demo-note">
        <p><strong>Note:</strong> This demo uses simulated data. In production, QR codes would be scanned from real emergency events.</p>
      </div>
    </div>
  );
};

export default QRScanner;

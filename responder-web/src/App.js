import React, { useState } from 'react';
import QRScanner from './components/QRScanner';
import EmergencyDetails from './components/EmergencyDetails';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [emergencyData, setEmergencyData] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'scanner', 'details'

  const handleLogin = (userData) => {
    setUser(userData);
    setView('scanner');
  };

  const handleQRScan = (data) => {
    setEmergencyData(data);
    setView('details');
  };

  const handleBackToScanner = () => {
    setEmergencyData(null);
    setView('scanner');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚑 Emergency Responder</h1>
        {user && <span>Logged in as: {user.name}</span>}
        <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
          Backend: 10.49.161.208:8000
        </div>
      </header>

      <main className="app-main">
        {view === 'login' && (
          <Login onLogin={handleLogin} />
        )}

        {view === 'scanner' && (
          <QRScanner onScan={handleQRScan} />
        )}

        {view === 'details' && (
          <EmergencyDetails 
            data={emergencyData} 
            onBack={handleBackToScanner}
          />
        )}
      </main>
    </div>
  );
}

export default App;

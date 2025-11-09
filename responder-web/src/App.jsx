import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import PatientDashboard from "./components/PatientDashboard";
import ResponderDashboard from "./components/ResponderDashboard";
import "./App.css";
import AboutUs from "./components/AboutUs";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div className="ehc-app">
        <Header user={user} onLogout={handleLogout} />

        <main className="ehc-content">
          <Routes>
            <Route
              path="/"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : user.user_type === "patient" ? (
                  <Navigate to="/patient" />
                ) : (
                  <Navigate to="/responder" />
                )
              }
            />
            <Route
              path="/patient"
              element={
                user && user.user_type === "patient" ? (
                  <PatientDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/responder"
              element={
                user && user.user_type === "responder" ? (
                  <ResponderDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;

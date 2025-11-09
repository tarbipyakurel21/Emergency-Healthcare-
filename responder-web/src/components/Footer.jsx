// src/components/Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="ehc-footer">
      <div className="ehc-footer-content">
        <p className="ehc-footer-title">🩺 Emergency Healthcare System</p>
        <p className="ehc-footer-desc">
          Empowering responders and patients with real-time emergency care and
          medical data access.
        </p>

        <div className="ehc-footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>

        <p className="ehc-footer-copy">
          © {new Date().getFullYear()} Emergency Healthcare. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

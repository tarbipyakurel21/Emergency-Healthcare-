// src/components/Header.jsx
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  return (
    <header className="ehc-header">
      {/* ===== Left: Logo ===== */}
      <div className="ehc-header-left">
        <Link to="/" className="ehc-logo-link">
          <h2 className="ehc-logo">🚨 Emergency Healthcare</h2>
        </Link>
      </div>

      {/* ===== Right: Controls ===== */}
      <div className="ehc-header-right">
        {/* Always visible About Us link */}
        <Link to="/about" className="ehc-about-btn">
          About Us
        </Link>

        {/* Show user greeting & logout only if logged in */}
        {user && (
          <>
            <span className="ehc-welcome">👋 Hi, {user.name}</span>
            <button className="ehc-logout" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

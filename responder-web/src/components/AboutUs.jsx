import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Tarbi Pyakurel",
      role: "Lead Developer",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      name: "Nasir Aliu",
      role: "Backend Engineer",
      img: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    },
    {
      name: "Lisa Ochieng",
      role: "UI/UX Designer",
      img: "https://cdn-icons-png.flaticon.com/512/2922/2922561.png",
    },
    {
      name: "Krish Karki",
      role: "AI Engineer & Research Lead",
      img: "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    },
  ];

  return (
    <div className="about-container">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <h1>🚨 Emergency Healthcare</h1>
        <p className="tagline">
          Empowering lives through rapid emergency response and intelligent healthcare systems.
        </p>
      </section>

      {/* ===== MISSION ===== */}
      <section className="mission-section">
        <h2>💡 Our Mission</h2>
        <p>
          At <strong>Emergency Healthcare</strong>, we are driven by one goal — to revolutionize
          how patients and responders connect during critical moments. Using advanced AI and 
          real-time systems, we ensure that every second counts toward saving lives.
        </p>
      </section>

      {/* ===== VISION ===== */}
      <section className="vision-section">
        <h2>🌍 Our Vision</h2>
        <p>
          We envision a world where emergency response is instantaneous, data-driven, and
          accessible to all. Through modern web technologies, geolocation, and AI, we bridge 
          the gap between those in need and those who can help.
        </p>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <h2>⚙️ What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🩸 Patient Dashboard</h3>
            <p>
              Manage your medical information securely and generate live QR codes for 
              emergency identification during crises.
            </p>
          </div>
          <div className="feature-card">
            <h3>🚑 Responder Panel</h3>
            <p>
              Access patient emergency data instantly through secure QR scans and coordinate 
              rapid on-site medical support.
            </p>
          </div>
          <div className="feature-card">
            <h3>🤖 AI Assistant "Chris"</h3>
            <p>
              Your friendly health companion — powered by NVIDIA AI — offering guidance for 
              first aid, medications, and safety advice.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="team-section">
        <h2>👩‍⚕️ Meet the Team</h2>
        <p className="team-intro">
          A passionate group of developers, healthcare professionals, and AI researchers 
          working together to create life-saving digital tools.
        </p>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-photo">
                <img src={member.img} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Emergency Healthcare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo1.png";
import "./css/login.css";

const termsContent = [
  {
    title: "1. Acceptance of Terms",
    text: "By registering and using Quanture, you agree to comply with our Terms & Conditions and Privacy Policy.",
  },
  {
    title: "2. Account Security",
    text: "You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
  },
  {
    title: "3. Data Privacy",
    text: "We collect and use your personal data solely to provide and improve our services. Please refer to our Privacy Policy for details.",
  },
  {
    title: "4. Prohibited Conduct",
    text: "Users must not misuse the platform, post harmful content, or interfere with other users’ experience.",
  },
];

function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side */}
        <div className="login-left">
          <img src={logo} alt="App Logo" className="app-logo floating" />
          <h2>Terms & Conditions</h2>
          <p>Please review the terms below carefully before using our services.</p>
        </div>

        {/* Right Side */}
        <div
          className="login-right"
          style={{ overflowY: "auto", maxHeight: "80vh", paddingRight: "15px" }}
        >
          <h3>Terms & Conditions</h3>
          <div style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
            {termsContent.map(({ title, text }, idx) => (
              <section key={idx} style={{ marginBottom: "1.3rem" }}>
                <strong>{title}</strong>
                <p>{text}</p>
              </section>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/register" className="forgot-link">
              &larr; Back to Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css";
import logo from "../assets/images/logo1.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 = Enter email, Step 2 = Enter OTP + new password
  const [formData, setFormData] = useState({
    emailOrUid: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password – Quanture";
    const favicon =
      document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.emailOrUid) newErrors.emailOrUid = "Email or UID is required";
    return newErrors;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.otp) newErrors.otp = "OTP is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 4) newErrors.newPassword = "Must be at least 4 characters";
    if (formData.confirmPassword !== formData.newPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const formErrors = validateStep1();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSuccess(false);
      return;
    }
    setErrors({});
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/forgot-password`, {
        email: formData.emailOrUid,
      });
      console.log("OTP sent:", res.data);
      setSuccess(true);
      setStep(2); // Move to OTP + new password step
    } catch (err) {
      setSuccess(false);
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ apiError: err.response.data.message });
      } else {
        setErrors({ apiError: "Server error. Try again." });
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const formErrors = validateStep2();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSuccess(false);
      return;
    }
    setErrors({});
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/reset-password`, {
        email: formData.emailOrUid,
        otp: formData.otp,
        password: formData.newPassword,
      });
      console.log("Password reset successful:", res.data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setSuccess(false);
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ apiError: err.response.data.message });
      } else {
        setErrors({ apiError: "Server error. Try again." });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Section */}
        <div className="login-left">
          <img src={logo} alt="App Logo" className="app-logo floating" />
          <h2>Forgot Your Password?</h2>
          <p>Reset it quickly and securely.</p>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <h3>Reset Password</h3>
          {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
          {success && <Alert variant="success">{step === 1 ? "OTP sent to your email!" : "Password reset successful!"}</Alert>}

          <Form onSubmit={step === 1 ? handleSendOTP : handleResetPassword}>
            {/* Step 1: Email/UID */}
            {step === 1 && (
              <Form.Group className="mb-3">
                <Form.Label>Email or UID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your email or UID"
                  value={formData.emailOrUid}
                  onChange={(e) => setFormData({ ...formData, emailOrUid: e.target.value })}
                  isInvalid={!!errors.emailOrUid}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.emailOrUid}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {/* Step 2: OTP + New Password */}
            {step === 2 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    isInvalid={!!errors.otp}
                  />
                  <Form.Control.Feedback type="invalid">{errors.otp}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    isInvalid={!!errors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            <Button variant="success" type="submit" className="w-100">
              {step === 1 ? "Send OTP" : "Reset Password"}
            </Button>
          </Form>

          <div className="text-end mt-1">
            <Link to="/login" className="forgot-link">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

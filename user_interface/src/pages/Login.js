import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css";
import logo from "../assets/images/logo1.png";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    uid: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Login – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.uid) {
      newErrors.uid = "UID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password/QPIN is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Must be at least 4 characters";
    }

    return newErrors;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSuccess(false);
    } else {
      setErrors({});
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        console.log("Login success:", res.data);
        setSuccess(true);

        localStorage.setItem("token", res.data.token);

        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);

        //navigate("/profile"); 

        // localStorage.setItem("token", res.data.token);

        navigate("/step-form");
      } catch (err) {
        setSuccess(false);
        if (err.response && err.response.data && err.response.data.message) {
          setErrors({ apiError: err.response.data.message });
        } else {
          setErrors({ apiError: "Server error. Try again." });
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Section */}
        <div className="login-left">
          <img src={logo} alt="App Logo" className="app-logo floating" />
          <h2>Welcome Back!</h2>
          <p>Track your market moves with ease.</p>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <h3>Login</h3>
          {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
          {success && <Alert variant="success">Login Successful!</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* UID */}
            <Form.Group className="mb-3">
              <Form.Label>UID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your UID"
                value={formData.uid}
                onChange={(e) =>
                  setFormData({ ...formData, uid: e.target.value })
                }
                isInvalid={!!errors.uid}
              />
              <Form.Control.Feedback type="invalid">
                {errors.uid}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-1">
              <Form.Label>Password / QPIN</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password or QPIN"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>

              {/* Forgot Password link */}
              <div className="text-end mt-1">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
            </Form.Group>

            {/* Submit Button <a href="/home1"> </a>*/}
            <Button variant="success" type="submit" className="w-100 mt-3">
              Login
            </Button>
            <div className="text-center mt-3">
              <span>New to this? </span>
              <Link to="/register" className="forgot-link">
                Please register first
              </Link>

            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;

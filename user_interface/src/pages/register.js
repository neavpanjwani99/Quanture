import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css";
import logo from "../assets/images/logo1.png";

function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        uid: "",
        pan: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Register – Quanture";

        const favicon =
            document.querySelector("link[rel='icon']") ||
            document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/png";
        favicon.href = logo;
        document.head.appendChild(favicon);
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Enter valid 10-digit mobile number";
        }
        if (!formData.uid) newErrors.uid = "UID is required";
        if (!formData.pan) {
            newErrors.pan = "PAN is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            newErrors.pan = "Invalid PAN format";
        }
        if (!formData.password || formData.password.length < 4)
            newErrors.password = "Password must be at least 4 characters";

        if (formData.confirmPassword !== formData.password)
            newErrors.confirmPassword = "Passwords do not match";

        if (!formData.agree)
            newErrors.agree = "You must agree to the terms and conditions";

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
                const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/register`, {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.mobile,
                    password: formData.password,
                });

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

        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Left */}
                <div className="login-left">
                    <img src={logo} alt="App Logo" className="app-logo floating" />
                    <h2>Welcome to Quanture!</h2>
                    <p>Register and start tracking your market moves.</p>
                </div>

                {/* Right */}
                <div className="login-right">
                    <h3>Register</h3>
                    {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
                    {success && <Alert variant="success">Registration Successful!</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({ ...formData, fullName: e.target.value })
                                }
                                isInvalid={!!errors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fullName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Email and Mobile in one row */}
                        <Row>
                            <Col>
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
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter 10-digit mobile number"
                                        value={formData.mobile}
                                        onChange={(e) =>
                                            setFormData({ ...formData, mobile: e.target.value })
                                        }
                                        isInvalid={!!errors.mobile}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.mobile}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* UID and PAN in one row */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>UID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Create a UID"
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
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>PAN Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="ABCDE1234F"
                                        value={formData.pan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pan: e.target.value.toUpperCase(),
                                            })
                                        }
                                        isInvalid={!!errors.pan}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.pan}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Password and Confirm Password in one row */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password / QPIN</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Create your password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        isInvalid={!!errors.confirmPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Agree checkbox */}
                        <Form.Group className="mb-3">
                            <div className="d-flex align-items-start">
                                <Form.Check
                                    type="checkbox"
                                    id="termsCheck"
                                    checked={formData.agree}
                                    onChange={(e) =>
                                        setFormData({ ...formData, agree: e.target.checked })
                                    }
                                    isInvalid={!!errors.agree}
                                />
                                <Form.Label htmlFor="termsCheck" className="ms-2">
                                    I agree to the{" "}
                                    <Link to="/terms" className="forgot-link" target="_blank" rel="noopener noreferrer">
                                        Terms & Conditions
                                    </Link>
                                </Form.Label>
                            </div>
                            {errors.agree && (
                                <div className="text-danger mt-1">{errors.agree}</div>
                            )}
                        </Form.Group>


                        {/* Submit Button */}
                            <Button variant="success" type="submit" className="w-100 mt-2">
                                Register
                            </Button>

                        {/* Link to Login */}
                        <div className="text-center mt-3">
                            <span>Already have an account? </span>
                            <Link to="/login" className="forgot-link">
                                Login here
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Register;

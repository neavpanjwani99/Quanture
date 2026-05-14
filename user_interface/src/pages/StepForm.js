// // src/pages/StepForm.js
// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import "./css/stepform.css";
import logo from "../assets/images/logo1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function StepForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    haveDemat: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
    aadhaar: null,
    pan: null,
    addressProof: null,
    bankProof: null,
    photo: null,
    signature: null,
    aadhaarMobile: "",
    incomeProof: null,
    panNumber: "",
    dob: "",
    dpId: "",
    dematBankAccount: "",
    dematIfsc: "",
    bankAccount: "",
    mobileNumber: "",   
    email: "",
    dematSignature: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Open Demat Account - Quanture";

    const link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = logo; // imported image ka path use karo
    document.head.appendChild(link);
  }, []);

  const handleFileChange = (field, file, allowedTypes = null) => {
    if (!file) {
      setErrors((prev) => ({ ...prev, [field]: "File is required" }));
      setFormData({ ...formData, [field]: null });
      return;
    }

    if (allowedTypes) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Only JPG, PNG, or PDF allowed",
        }));
        setFormData({ ...formData, [field]: null });
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File must be under 2MB",
        }));
        setFormData({ ...formData, [field]: null });
        return;
      }
    }

    setErrors((prev) => ({ ...prev, [field]: null })); // clear previous error
    setFormData({ ...formData, [field]: file });
  };



  // Validation helpers
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!file) return true;
    if (!allowedTypes.includes(file.type))
      return "Only JPG, PNG, or PDF allowed";
    if (file.size > maxSize) return "File must be under 2MB";
    return true;
  };

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.haveDemat) {
        newErrors.haveDemat = "Please select Yes or No";
      }
    } else {
      if (formData.haveDemat === "no") {
        if (!formData.bankName) newErrors.bankName = "Bank name is required";
        if (!/^\d+$/.test(formData.accountNumber))
          newErrors.accountNumber = "Account number must be numeric";
        if (!/^[A-Z]{4}0\d{6}$/.test(formData.ifsc))
          newErrors.ifsc = "Invalid IFSC code";
        if (!formData.upiId.includes("@"))
          newErrors.upiId = "Invalid UPI ID format";
        if (!formData.mobileNumber.match(/^\d{10}$/))
          newErrors.mobileNumber = "Mobile must be 10 digits";
        if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Invalid email";


        const fileChecks = [
          "aadhaar",
          "pan",
          "addressProof",
          "bankProof",
          "photo",
          "signature",
        ];
        fileChecks.forEach((f) => {
          const res = validateFile(formData[f]);
          if (res !== true) newErrors[f] = res;
        });
      } else if (formData.haveDemat === "yes") {
        if (!formData.panNumber) newErrors.panNumber = "PAN is required";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob))
          newErrors.dob = "DOB must be YYYY-MM-DD";
        if (!/^\d{16}$/.test(formData.dpId))
          newErrors.dpId = "DP ID must be 16 digits";
        if (!formData.mobileNumber.match(/^\d{10}$/))
          newErrors.mobileNumber = "Mobile must be 10 digits";
        if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Invalid email";
        const fileRes = validateFile(formData.dematSignature);
        if (fileRes !== true) newErrors.dematSignature = fileRes;
      }
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };

      await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/details`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire({
        title: "Success ",
        text: "Form submitted successfully!",
        icon: "success",
        confirmButtonText: "Okay",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/home1");
      });

    } catch (error) {
      console.error("Submit Error:", error);

      Swal.fire({
        title: "Error ",
        text: "Something went wrong, please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleNext = () => {
    const formErrors = validateStep();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      if (step === 1) {
        setStep(2);
      } else {
        handleSubmit();
      }
    }
  };


  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side */}
        <div className="login-left">
          <img src={logo} alt="App Logo" className="app-logo floating" />
          <h2>Open Your Demat Account</h2>
          <p>Complete the steps below to get started.</p>
        </div>

        {/* Right Side */}
        <div className="login-right">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              {step > 1 ? <FaCheckCircle /> : "1"}
              <span>Basic Info</span>
            </div>
            <div className="line"></div>
            <div className={`step ${step === 2 ? "active" : ""}`}>
              {success ? <FaCheckCircle /> : "2"}
              <span>Details</span>
            </div>
          </div>

          {success && (
            <Alert variant="success">Form submitted successfully!</Alert>
          )}

          {!success && (
            <>
              {step === 1 && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Do you have a Demat Account?</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label="Yes"
                        name="haveDemat"
                        onChange={() => handleChange("haveDemat", "yes")}
                        checked={formData.haveDemat === "yes"}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="haveDemat"
                        onChange={() => handleChange("haveDemat", "no")}
                        checked={formData.haveDemat === "no"}
                      />
                    </div>
                    {errors.haveDemat && (
                      <div className="text-danger">{errors.haveDemat}</div>
                    )}
                  </Form.Group>
                  <Button variant="success" onClick={handleNext}>
                    Next
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form>
                  {formData.haveDemat === "no" && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.bankName}
                              onChange={(e) =>
                                handleChange("bankName", e.target.value)
                              }
                              isInvalid={!!errors.bankName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bankName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Account Number</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.accountNumber}
                              onChange={(e) =>
                                handleChange("accountNumber", e.target.value)
                              }
                              isInvalid={!!errors.accountNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.accountNumber}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>IFSC Code</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.ifsc}
                              onChange={(e) =>
                                handleChange("ifsc", e.target.value)
                              }
                              isInvalid={!!errors.ifsc}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.ifsc}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>UPI ID</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.upiId}
                              onChange={(e) =>
                                handleChange("upiId", e.target.value)
                              }
                              isInvalid={!!errors.upiId}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.upiId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* File uploads in two columns */}
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Aadhaar Card</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "aadhaar",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.aadhaar}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.aadhaar}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>PAN Card</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "pan",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.pan}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pan}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Address Proof</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "addressProof",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.addressProof}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.addressProof}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank Proof</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "bankProof",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.bankProof}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bankProof}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Passport-size Photo</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "photo",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.photo}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.photo}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Signature (scanned)</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "signature",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.signature}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.signature}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.mobileNumber}
                              onChange={(e) => handleChange("mobileNumber", e.target.value)}
                              isInvalid={!!errors.mobileNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mobileNumber}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleChange("email", e.target.value)}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                    </>
                  )}

                  {formData.haveDemat === "yes" && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>PAN Card</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.panNumber}
                              onChange={(e) =>
                                handleChange("panNumber", e.target.value)
                              }
                              isInvalid={!!errors.panNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.panNumber}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                              type="date"
                              value={formData.dob}
                              onChange={(e) =>
                                handleChange("dob", e.target.value)
                              }
                              isInvalid={!!errors.dob}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.dob}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>DP ID / BO ID</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.dpId}
                              onChange={(e) =>
                                handleChange("dpId", e.target.value)
                              }
                              isInvalid={!!errors.dpId}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.dpId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank Account Number</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.bankAccount}
                              onChange={(e) =>
                                handleChange("bankAccount", e.target.value)
                              }
                              isInvalid={!!errors.bankAccount}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bankAccount}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>IFSC Code</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.ifsc}
                              onChange={(e) =>
                                handleChange("ifsc", e.target.value)
                              }
                              isInvalid={!!errors.ifsc}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.ifsc}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.mobileNumber}   // ab undefined nahi hoga
                              onChange={(e) => handleChange("mobileNumber", e.target.value)}
                              isInvalid={!!errors.mobileNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mobileNumber}
                            </Form.Control.Feedback>

                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Signature Upload</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                handleFileChange(
                                  "dematSignature",
                                  e.target.files[0],
                                  ["image/jpeg", "image/png", "application/pdf"]
                                )
                              }
                              isInvalid={!!errors.dematSignature}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.dematSignature}
                            </Form.Control.Feedback>
                          </Form.Group>

                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="secondary" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button variant="success" onClick={handleNext}>
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StepForm;

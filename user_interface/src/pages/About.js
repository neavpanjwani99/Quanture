// AboutUs.js
import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import logo from "../assets/images/logo1.png";
import neav from "../assets/images/neav1.jpg";
import jay from "../assets/images/jay1.jpg";
import dhiraj from "../assets/images/dhiraj2.jpg";
import "animate.css";

export default function AboutUs() {
  // Page Title & Favicon
  useEffect(() => {
    document.title = "About Us – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  return (
    <Container style={{ padding: "2rem" }}>
      {/* Header */}
      <motion.div
        className="mb-5 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src={logo} alt="Logo" style={{ width: "100px", marginBottom: "1rem" }} />
        <h2>About Quanture</h2>
        <p className="text-muted">
          Empowering investors with real-time stock insights and seamless trading experience.
        </p>
      </motion.div>

      {/* Mission / Vision */}
      <Row className="mb-4">
        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-3 shadow-sm rounded-4 mb-3">
              <h5>Our Mission</h5>
              <p>
                To provide investors with accurate, real-time stock data and intuitive tools
                to make informed financial decisions.
              </p>
            </Card>
          </motion.div>
        </Col>
        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-3 shadow-sm rounded-4 mb-3">
              <h5>Our Vision</h5>
              <p>
                To become the most trusted platform for stock analysis and trading guidance,
                empowering users worldwide.
              </p>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="mb-3 text-center">Meet the Team</h4>
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <Card className="p-3 shadow-sm rounded-4">
              <img
                src={neav}
                alt="Neav Panjwani"
                className="rounded-circle mb-2"
                style={{ width: "90px", height: "90px", objectFit: "cover" }}
              />
              <h6>Neav Panjwani</h6>
              <small className="text-muted">Founder & CEO</small>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="p-3 shadow-sm rounded-4">
              <img
                src={jay}
                alt="Jay Thadani"
                className="rounded-circle mb-2"
                style={{ width: "90px", height: "90px", objectFit: "cover" }}
              />
              <h6>Jay Thadani</h6>
              <small className="text-muted">Head of Design</small>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="p-3 shadow-sm rounded-4">
              <img
                src={dhiraj}
                alt="Dhiraj Suhanda"
                className="rounded-circle mb-2"
                style={{ width: "90px", height: "90px", objectFit: "cover" }}
              />
              <h6>Dhiraj Suhanda</h6>
              <small className="text-muted">Lead Developer</small>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}

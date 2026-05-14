// Contact.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Toast, ToastContainer } from "react-bootstrap";
import { motion } from "framer-motion";
import logo from "../assets/images/logo1.png";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = new Date().getTime();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    document.title = "Contact Us – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Bad words list (expandable)
  const badWords = ["fuck", "shit", "bitch", "asshole", "bastard"];

  // Check if message contains bad words
  const containsBadWords = (text) => {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast("Please fill all fields!", "danger");
      return;
    }

    // Check for bad words
    if (containsBadWords(formData.message)) {
      addToast("Don't use prohibited language!", "danger");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        addToast("Message sent successfully!", "success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        addToast(data.message || "Something went wrong", "danger");
      }
    } catch (error) {
      console.error(error);
      addToast("Server error. Try again later.", "danger");
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h2>Contact Us</h2>
        <p className="text-muted">We'd love to hear from you! Send us a message below.</p>
      </motion.div>

      <Row className="justify-content-center">
        <Col md={8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 shadow-sm rounded-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map(toast => (
          <Toast key={toast.id} show={true} bg={toast.type} autohide delay={4000}>
            <Toast.Header>
              <strong className="me-auto">{toast.type.toUpperCase()}</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </Container>
  );
}

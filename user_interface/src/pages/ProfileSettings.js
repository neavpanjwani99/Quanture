// ProfileSettings.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/images/logo1.png";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Live image preview
  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
      triggerToast("Profile picture updated!");
    }
  };

  // Save instantly with toast
  const handleChange = (setter, value, msg) => {
    setter(value);
    triggerToast(msg);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Profile – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);

    // Fetch user profile from backend
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          triggerToast("You are not logged in");
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        if (data.profilePic) setPreview(data.profilePic);
      } catch (err) {
        console.error(err.message);
        triggerToast("Failed to load profile. Please login again.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container style={{ padding: "2rem" }}>
      <h2 className="text-center mb-4">Profile Settings</h2>

      <Card className="p-4 shadow-lg rounded-4">
        <div className="text-center mb-4">
          {preview ? (
            <img src={preview} alt="Profile Preview" className="profile-pic" />
          ) : (
            <FaUserCircle size={100} color="#bbb" />
          )}
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleProfilePic}
            className="mt-3"
          />
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => handleChange(setName, e.target.value, "Name updated!")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => handleChange(setEmail, e.target.value, "Email updated!")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              placeholder="Write something about yourself..."
              onChange={(e) => handleChange(setBio, e.target.value, "Bio updated!")}
            />
          </Form.Group>
        </Form>
      </Card>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          show={showToast}
          bg="success"
          onClose={() => setShowToast(false)}
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

      <style>{`
        .profile-pic {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </Container>
  );
}

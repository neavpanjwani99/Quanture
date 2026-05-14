import React, { useState, useEffect, useRef } from "react";
import "./css/Home.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import Chart from "react-apexcharts";
import {
  FiTrendingUp,
  FiZap,
  FiShield,
  FiBarChart2,
  FiActivity,
} from "react-icons/fi";
import image from "../assets/images/image.png";
import icon from "../assets/images/icon.webp";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo from "../assets/images/logo1.png";

export default function Home() {
  // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Home – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  const MySwal = withReactContent(Swal);

  // Mock login status (replace with real auth check)
  const [isLoggedIn] = useState(false);

  // Alert function
  const showLoginAlert = () => {
    MySwal.fire({
      title: "Login Required",
      text: "Please login to continue.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login Now",
      background: "#fff",
      backdrop: `rgba(0,0,0,0.4)`,
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to login page
        window.location.href = "/login";
      }
    });
  };

  // Live Market Stats for Hero Section
  const [marketStats, setMarketStats] = useState([
    { name: "Sensex", value: 1.25 },
    { name: "Nifty 50", value: 0.98 },
    { name: "BTC", value: -0.45 },
  ]);
  const [changedIndex, setChangedIndex] = useState(null);

  // Intersection Observer for fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Update market stats every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStats((prev) =>
        prev.map((item, index) => {
          const change = (Math.random() * 0.2 - 0.1).toFixed(2);
          const newValue = parseFloat(
            (item.value + parseFloat(change)).toFixed(2)
          );
          if (index === Math.floor(Math.random() * prev.length)) {
            setChangedIndex(index);
            setTimeout(() => setChangedIndex(null), 400);
          }
          return { ...item, value: newValue };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const learnVideos = [
    {
      title: "Basics of Stocks",
      videoUrl: "https://www.youtube.com/embed/3UF0ymVdYLA",
    },
    {
      title: "Understanding Mutual Funds",
      videoUrl: "https://www.youtube.com/embed/PbldLCsspgE",
    },
    {
      title: "Long-term Investing",
      videoUrl: "https://www.youtube.com/embed/EY44rGS-uUs",
    },
    {
      title: "Risk Management",
      videoUrl: "https://www.youtube.com/embed/s7KApswForA",
    },
    {
      title: "Market Trends",
      videoUrl: "https://www.youtube.com/embed/iRO5qjkNCFY",
    },
    {
      title: "Portfolio Diversification",
      videoUrl: "https://www.youtube.com/embed/iOCbdCHtP4M",
    },
  ];

  const marketData = [
    { name: "TCS", change: +1.25 },
    { name: "RELIANCE", change: -0.54 },
    { name: "INFY", change: +2.14 },
    { name: "HDFC", change: -0.89 },
    { name: "SBIN", change: +1.04 },
  ];

  const chartSeries = [
    {
      data: [
        { x: new Date(2025, 0, 1), y: [51.98, 56.29, 51.59, 53.85] },
        { x: new Date(2025, 0, 2), y: [53.66, 54.99, 51.35, 52.95] },
        { x: new Date(2025, 0, 3), y: [52.96, 53.78, 51.54, 52.48] },
        { x: new Date(2025, 0, 4), y: [52.54, 52.79, 51.33, 52.03] },
      ],
    },
  ];

  const chartOptions = {
    chart: {
      type: "candlestick",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: { type: "datetime" },
    yaxis: { tooltip: { enabled: true } },
    grid: {
      borderColor: "#f0f0f0",
    },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        ref={(el) => (sectionRefs.current.hero = el)}
        data-id="hero"
        className={`hero-section fade-section ${
          visibleSections.hero ? "visible" : ""
        } bg-light text-dark`}
        style={{
          padding: "80px 0",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Container className="d-flex align-items-center justify-content-between flex-wrap">
          {/* Left Content */}
          <div className="hero-text" style={{ maxWidth: "560px" }}>
            <h1 className="display-4 fw-bold mb-3">Trade Smart. Grow Fast.</h1>
            <p className="fs-5 text-muted mb-4">
              Real-time data. AI insights. Zero clutter.
            </p>

            <div className="d-flex gap-3 mb-5">
              <Button
                variant="success"
                size="lg"
                style={{ backgroundColor: "#28a745", border: "none" }}
                onClick={() => {
                  if (!isLoggedIn) {
                    showLoginAlert();
                  }
                }}
              >
                Start Trading <FaArrowRight className="ms-2" />
              </Button>
              <Button
                variant="outline-success"
                size="lg"
                onClick={() => {
                  if (!isLoggedIn) {
                    showLoginAlert();
                  }
                }}
              >
                Explore the Market
              </Button>
            </div>

            {/* Dynamic Market Stats */}
            <div className="d-flex gap-4 text-muted small">
              {marketStats.map((item, idx) => (
                <div
                  key={idx}
                  className={`market-stat ${item.value >= 0 ? "up" : "down"} ${
                    changedIndex === idx ? "change" : ""
                  }`}
                >
                  {item.name}: {item.value >= 0 ? "+" : ""}
                  {item.value}%
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual: Live Chart */}
          <div
            className="hero-visual mt-4 mt-md-0"
            style={{
              maxWidth: "740px",
              flex: "1",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
            }}
          >
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="candlestick"
              height={460}
              width="100%"
            />
          </div>
        </Container>
      </section>

      {/* Learn Investing */}
      <section
        ref={(el) => (sectionRefs.current.learn = el)}
        data-id="learn"
        className={`learn-section py-5 fade-section ${
          visibleSections.learn ? "visible" : ""
        }`}
      >
        <Container>
          <h2 className="section-title mb-5 text-dark fw-bold position-relative">
            Learn Investing
            <span
              style={{
                content: "",
                position: "absolute",
                width: "50px",
                height: "4px",
                background: "linear-gradient(90deg, #28a745, #17a2b8)",
                bottom: "-8px",
                left: "0",
                borderRadius: "2px",
              }}
            ></span>
          </h2>
          <Row>
            {learnVideos.map((video, idx) => (
              <Col md={4} sm={6} xs={12} key={idx} className="mb-4">
                <Card className="learn-card border-0 shadow-sm">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      allowFullScreen
                      style={{ border: "none" }}
                    ></iframe>
                  </div>
                  <Card.Body>
                    <Card.Title>{video.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section
        ref={(el) => (sectionRefs.current.features = el)}
        data-id="features"
        className={`features-section py-5 fade-section ${
          visibleSections.features ? "visible" : ""
        }`}
      >
        <Container>
          <h2 className="section-title mb-5 text-dark fw-bold position-relative">
            Why Choose Us?
            <span
              style={{
                content: "",
                position: "absolute",
                width: "50px",
                height: "4px",
                background: "linear-gradient(90deg, #28a745, #17a2b8)",
                bottom: "-8px",
                left: "0",
                borderRadius: "2px",
              }}
            ></span>
          </h2>

          <Row>
            {[
              {
                icon: <FiTrendingUp size={42} color="#fff" />,
                title: "Real-time Market Data",
                desc: "Get the latest updates instantly.",
                bg: "linear-gradient(135deg, #28a745, #6ccf87)",
              },
              {
                icon: <FiZap size={42} color="#fff" />,
                title: "Smart Insights",
                desc: "AI-powered analytics for better decisions.",
                bg: "linear-gradient(135deg, #ffc107, #ffcd39)",
              },
              {
                icon: <FiShield size={42} color="#fff" />,
                title: "Secure & Reliable",
                desc: "Bank-grade security for your assets.",
                bg: "linear-gradient(135deg, #17a2b8, #48c6d9)",
              },
            ].map((f, idx) => (
              <Col md={4} key={idx}>
                <div
                  className="feature-card text-center p-4 rounded shadow-sm"
                  style={{
                    background: "#fff",
                    transition: "all 0.4s ease",
                    transform: "translateY(0)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.querySelector(
                      ".feature-bg"
                    ).style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.querySelector(
                      ".feature-bg"
                    ).style.transform = "scale(1)";
                  }}
                >
                  <div
                    className="feature-bg"
                    style={{
                      background: f.bg,
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      zIndex: "0",
                      opacity: "0.15",
                      transition: "transform 0.4s ease",
                    }}
                  ></div>
                  <div
                    className="feature-icon mb-3"
                    style={{
                      background: f.bg,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      width: "70px",
                      height: "70px",
                      marginBottom: "15px",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                      animation: "pulseIcon 2s infinite",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    {f.icon}
                  </div>
                  <h5
                    className="fw-bold position-relative"
                    style={{ zIndex: 1 }}
                  >
                    {f.title}
                  </h5>
                  <p
                    className="text-muted position-relative"
                    style={{ zIndex: 1 }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        <style>
          {`
      @keyframes pulseIcon {
        0% { transform: scale(1); }
        50% { transform: scale(1.08); }
        100% { transform: scale(1); }
      }
    `}
        </style>
      </section>

      {/* grow like page */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "80px 0",
        }}
      >
        <Container>
          <Row className="align-items-center">
            {/* Left Side Text */}
            <Col md={6}>
              <img
                src={icon} // Left side top icon
                alt="Icon"
                style={{ width: "60px", marginBottom: "20px" }}
              />
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#2a2a2a",
                  marginBottom: "10px",
                }}
              >
                Indian markets at your fingertips.
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#6c757d",
                  marginBottom: "30px",
                }}
              >
                Long-term or short-term, high risk or low risk. Be the kind of
                investor you want to be.
              </p>

              {/* Features List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {[
                  {
                    icon: <FiTrendingUp size={22} />,
                    text: "Stocks & Intraday",
                  },
                  {
                    icon: <FiBarChart2 size={22} />,
                    text: "Mutual funds & SIPs",
                  },
                  {
                    icon: <FiActivity size={22} />,
                    text: "Futures & Options",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 20px",
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div style={{ color: "#00b386", marginRight: "15px" }}>
                      {item.icon}
                    </div>
                    <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </Col>

            {/* Right Side Phone Image */}
            <Col
              md={6}
              className="d-flex justify-content-center"
              style={{ position: "relative" }}
            >
              <img
                src={image}
                alt="Phone"
                style={{
                  maxWidth: "300px",
                  borderRadius: "35px",
                  transform: "translateX(120px)", // yaha pixels adjust karo
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

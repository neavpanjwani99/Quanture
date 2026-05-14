import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Chart from "react-apexcharts";
import { FiTrendingUp, FiZap, FiShield } from "react-icons/fi";
import image from "../assets/images/image.png";
import icon from "../assets/images/icon.webp";
import "./css/home1.css";
import { FiBarChart2, FiActivity } from "react-icons/fi";
import { FaRegFileAlt } from "react-icons/fa";

import logo from "../assets/images/logo1.png";

export default function Home() {
  const sectionBg = {
    background: "rgba(223, 242, 194, 0.6)",
    borderRadius: "15px",
  };

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
  const accentColor = "#5A7A4A";
  const textColor = "#222";
  

  // Sample chart data for "Market Overview"
  const chartOptions = {
    chart: { id: "basic-bar", toolbar: { show: false } },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    colors: [accentColor],
  };

  
  const chartSeries = [
    {
      name: "Nifty 50",
      data: [17300, 17450, 17200, 17500, 17600, 17700],
    },
  ];

  return (
    <div style={{ background: "white", color: textColor, minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container
        style={{
          ...sectionBg,
          padding: "3rem",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <Row className="align-items-center">
          <Col md={6}>
            <h1>Welcome to Quanture</h1>
            <p>Track your stocks, see profits and losses in real-time.</p>
            <a href="/market"><Button
              style={{
                backgroundColor: accentColor,
                border: "none",
                borderRadius: "25px",
              }}
            >
              Explore Market
            </Button></a>
          </Col>
          <Col md={6}>
            <Chart
              options={{
                chart: {
                  id: "profit-loss-chart",
                  toolbar: { show: false },
                },
                xaxis: {
                  categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                },
                stroke: { curve: "smooth" },
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.6,
                    opacityTo: 0.1,
                    stops: [0, 90, 100],
                  },
                },
                colors: ["#5A7A4A"], // green for positive
                grid: { borderColor: "#e0e0e0" },
                yaxis: {
                  labels: {
                    formatter: (val) => `${val >= 0 ? "+" : ""}${val} ₹`,
                  },
                },
              }}
              series={[
                {
                  name: "Profit/Loss",
                  // Negative values = loss, Positive = profit
                  data: [200, -150, 300, -50, 400, -100, 250],
                },
              ]}
              type="area"
              height={250}
            />
          </Col>
        </Row>
      </Container>

      {/* Market Overview */}
      <Container
        style={{ ...sectionBg, padding: "2rem", marginBottom: "2rem" }}
      >
        <h2 className="text-center mb-4">Market Overview</h2>
        <Row className="g-4">
          {["Nifty 50", "Sensex", "Gold"].map((item, idx) => (
            <Col md={4} key={idx}>
              <Card
                className="text-center shadow-sm"
                style={{ borderRadius: "15px" }}
              >
                <Card.Body>
                  <Card.Title>{item}</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    ₹
                    {item === "Nifty 50"
                      ? "17,300"
                      : item === "Sensex"
                      ? "58,000"
                      : "48,000"}
                  </Card.Text>
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="line"
                    height={150}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Market Insights Section */}
      <Container
        style={{ ...sectionBg, padding: "2rem", marginBottom: "2rem" }}
      >
        <h2 className="text-center mb-4">Market Insights</h2>
        <Row className="g-4 text-center">
          {/* Top Gainers */}
          <Col md={4}>
            <Card className="insight-card p-3 shadow-sm">
              <FiBarChart2 size={40} color={accentColor} />
              <h5 className="mt-3">Top Gainers</h5>
              <p>Stocks that surged the most today.</p>
              <ul
                style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}
              >
                <li>
                  <strong>Reliance</strong>: +2.5%
                </li>
                <li>
                  <strong>TCS</strong>: +1.8%
                </li>
                <li>
                  <strong>Infosys</strong>: +1.6%
                </li>
              </ul>
              <Chart
                options={{
                  chart: { sparkline: { enabled: true } },
                  stroke: { curve: "smooth" },
                  colors: ["#5A7A4A"],
                }}
                series={[{ data: [120, 150, 180, 170, 200] }]}
                type="line"
                height={80}
              />
            </Card>
          </Col>

          {/* Top Losers */}
          <Col md={4}>
            <Card className="insight-card p-3 shadow-sm">
              <FiActivity size={40} color={accentColor} />
              <h5 className="mt-3">Top Losers</h5>
              <p>Stocks that dropped the most today.</p>
              <ul
                style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}
              >
                <li>
                  <strong>Yes Bank</strong>: -3.2%
                </li>
                <li>
                  <strong>BPCL</strong>: -2.1%
                </li>
                <li>
                  <strong>HCL Tech</strong>: -1.9%
                </li>
              </ul>
              <Chart
                options={{
                  chart: { sparkline: { enabled: true } },
                  stroke: { curve: "smooth" },
                  colors: ["#D9534F"],
                }}
                series={[{ data: [200, 180, 150, 140, 120] }]}
                type="line"
                height={80}
              />
            </Card>
          </Col>

          {/* Market Sentiment */}
          <Col md={4}>
            <Card className="insight-card p-3 shadow-sm">
              <FiZap size={40} color={accentColor} />
              <h5 className="mt-3">Market Sentiment</h5>
              <p>See if the market is bullish or bearish.</p>
              <ul
                style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}
              >
                <li>
                  <strong>Nifty 50</strong>: +0.8%
                </li>
                <li>
                  <strong>Sensex</strong>: +0.6%
                </li>
              </ul>
              <Chart
                options={{
                  chart: { sparkline: { enabled: true } },
                  stroke: { curve: "smooth" },
                  colors: ["#FFC107"],
                }}
                series={[{ data: [50, 55, 60, 58, 65] }]}
                type="area"
                height={80}
              />
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Latest Market News Section */}
      <Container
        style={{ ...sectionBg, padding: "2rem", marginBottom: "2rem" }}
      >
        <h2 className="text-center mb-4">Latest Market News</h2>
        <Row className="g-3">
          {[
            {
              title: "Sensex & Nifty Snap 6-Week Losing Streak",
              description:
                "Indian benchmark indices closed higher, ending a six-week losing run driven by trade tensions and muted quarterly earnings.",
              source: "LiveMint",
              link: "https://www.livemint.com/market/stock-market-news/indian-stock-market-sensex-nifty-snap-6-week-losing-streak-is-this-the-start-of-a-recovery-or-just-a-dead-cat-bounce-11755241233900.html",
            },
            {
              title: "Temple Priest Loses Over ₹12 Lakh in Investment Fraud",
              description:
                "A temple priest in Hyderabad fell victim to a stock market investment scam, losing ₹12.5 lakh. Authorities have initiated an investigation.",
              source: "Times of India",
              link: "https://timesofindia.indiatimes.com/city/hyderabad/temple-priest-loses-over-rs-12-lakh-in-stock-market-investment-fraud/articleshow/123306966.cms",
            },
            {
              title: "Independence Day 2025: NSE & BSE Closed",
              description:
                "Indian stock markets were closed on August 15 for Independence Day, marking two holidays in August, including Ganesh Chaturthi on August 27.",
              source: "Economic Times",
              link: "https://economictimes.indiatimes.com/markets/stocks/news/stock-market-holiday-2025-are-nse-bse-open-or-closed-today-for-independence-day-2025-check-now/articleshow/123306996.cms",
            },
            {
              title: "Reliance Industries Sees Surge in Retail Revenue",
              description:
                "Reliance Industries reported a 10% increase in retail revenue in Q1 2025, driven by e-commerce growth and expanding store network.",
              source: "Economic Times",
              link: "https://economictimes.indiatimes.com/industry/retail/reliance-industries-q1-retail-revenue-growth/articleshow/123320000.cms",
            },
          ].map((news, idx) => (
            <Col md={6} key={idx}>
              <Card className="shadow-sm p-3 d-flex flex-row align-items-start gap-3">
                {/* Left side icon */}
                <div style={{ fontSize: "2.5rem", color: accentColor }}>
                  <FaRegFileAlt />
                </div>
                {/* Text content */}
                <div>
                  <Card.Title>{news.title}</Card.Title>
                  <Card.Text style={{ fontSize: "0.95rem" }}>
                    {news.description}
                  </Card.Text>
                  <a href={news.link} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

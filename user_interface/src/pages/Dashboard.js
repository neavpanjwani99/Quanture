import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./css/Dashboard.css";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState({
    invested: 150000,
    profitLoss: 4500,
  });

  const gainers = [
    { name: "RELIANCE", change: "+3.5%" },
    { name: "TCS", change: "+2.1%" },
    { name: "INFY", change: "+1.8%" },
  ];

  const losers = [
    { name: "HDFC", change: "-2.5%" },
    { name: "ICICI", change: "-1.9%" },
    { name: "AXIS", change: "-1.2%" },
  ];

  // Example live update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio((prev) => ({
        ...prev,
        profitLoss:
          prev.profitLoss +
          (Math.random() > 0.5 ? Math.floor(Math.random() * 200) : -Math.floor(Math.random() * 200)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="dashboard-container py-4">
      {/* Portfolio Summary */}
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Card className="glass-card text-center p-4">
            <h4>Total Invested</h4>
            <h2>₹ {portfolio.invested.toLocaleString()}</h2>
            <h5
              className={`profit-loss ${
                portfolio.profitLoss >= 0 ? "profit" : "loss"
              }`}
            >
              {portfolio.profitLoss >= 0 ? "+" : ""}
              {portfolio.profitLoss.toLocaleString()}
            </h5>
          </Card>
        </Col>
      </Row>

      {/* Heatmap */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3">
            <h5 className="mb-3">Top Gainers</h5>
            <div className="heatmap-grid">
              {gainers.map((stock, idx) => (
                <div key={idx} className="heatmap-block gain">
                  <span>{stock.name}</span>
                  <small>{stock.change}</small>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h5 className="mb-3">Top Losers</h5>
            <div className="heatmap-grid">
              {losers.map((stock, idx) => (
                <div key={idx} className="heatmap-block loss">
                  <span>{stock.name}</span>
                  <small>{stock.change}</small>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Links */}
      <Row>
        {[
          { title: "Stocks Listing", icon: "📊" },
          { title: "Portfolio", icon: "💼" },
          { title: "Transactions", icon: "💳" },
        ].map((link, idx) => (
          <Col md={4} key={idx}>
            <Card className="quick-link-card text-center p-4">
              <div className="quick-icon">{link.icon}</div>
              <h5>{link.title}</h5>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

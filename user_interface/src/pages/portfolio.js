// Portfolio.js
import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Button, Row, Col, Alert, Modal, Form } from "react-bootstrap";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowUp, FaArrowDown, FaMinus, FaEnvelope } from "react-icons/fa";
import logo from "../assets/images/logo1.png";

export default function Portfolio() {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Portfolio – Quanture";
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  // Fetch portfolio from backend
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to view your portfolio.");

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/trades/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = data.portfolio.map((p) => ({
          symbol: p.stock,
          shares: p.quantity,
          invested: p.cost,
          price: p.currentPrice,
          currentValue: p.currentValue,
          profitLoss: p.unrealizedPL + p.realizedPL,
          profitLossPercent: p.unrealizedPLPercent,
        }));

        setHoldings(formatted);
        setTotalValue(formatted.reduce((sum, h) => sum + h.currentValue, 0));
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load portfolio.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Dynamic price fluctuation (optional visual effect)
  useEffect(() => {
    if (!loading && holdings.length > 0) {
      const interval = setInterval(() => {
        setHoldings((prev) =>
          prev.map((h) => {
            const changePercent = (Math.random() * 2 - 1).toFixed(2);
            const newPrice = +(h.price * (1 + changePercent / 100)).toFixed(2);
            const currentValue = newPrice * h.shares;
            const profitLoss = currentValue - h.invested;
            const profitLossPercent = h.invested > 0 ? (profitLoss / h.invested) * 100 : 0;
            return { ...h, price: newPrice, currentValue, profitLoss, profitLossPercent };
          })
        );
        setTotalValue((prev) =>
          holdings.reduce((sum, h) => sum + h.currentValue, 0)
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading, holdings]);

  // Email Portfolio
  const handleEmailSend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/trades/portfolio/email`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Portfolio emailed successfully!");
        setShowEmailModal(false);
      } else if (emailAddress) {
        await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/trades/portfolio/email`,
          { email: emailAddress }
        );
        alert("Portfolio emailed successfully!");
        setShowEmailModal(false);
      } else {
        alert("Enter an email address.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send portfolio email.");
    }
  };

  if (loading)
    return <Container className="text-center" style={{ padding: "2rem" }}><Spinner animation="border" /> Loading portfolio...</Container>;
  if (error)
    return <Container style={{ padding: "2rem" }}><Alert variant="danger">{error}</Alert></Container>;
  if (holdings.length === 0)
    return <Container style={{ padding: "2rem" }}><Alert variant="info">No holdings available.</Alert></Container>;

  const chartOptions = {
    chart: { type: "bar", height: 300, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    xaxis: { categories: holdings.map((h) => h.symbol) },
    yaxis: { labels: { formatter: (val) => Math.round(val) } },
    tooltip: { y: { formatter: (val) => `₹${val.toFixed(2)}` } },
  };
  const chartSeries = [{ name: "Value", data: holdings.map((h) => h.currentValue) }];

  return (
    <Container style={{ padding: "2rem" }}>
      <h2 className="mb-4 text-center">My Portfolio</h2>

      {/* Chart + Email + Total */}
      <Row className="mb-3">
        <Col md={9}><Chart options={chartOptions} series={chartSeries} type="bar" height={300} /></Col>
        <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
          <h4>Total Portfolio</h4>
          <h3>₹{totalValue.toFixed(2)}</h3>
          <Button variant="primary" className="mt-3" onClick={() => setShowEmailModal(true)}>
            <FaEnvelope /> Email Portfolio
          </Button>
        </Col>
      </Row>

      {/* Holdings Table */}
      <h5>Holdings</h5>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Shares</th>
            <th>Current Price (₹)</th>
            <th>Total Invested (₹)</th>
            <th>Profit / Loss (₹)</th>
            <th>Profit / Loss (%)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, idx) => (
            <tr key={idx} style={{ cursor: "pointer" }} onClick={() => navigate(`/stock/${h.symbol}`)}>
              <td>{h.symbol}</td>
              <td>{h.shares}</td>
              <td>₹{h.price.toFixed(2)}</td>
              <td>₹{h.invested.toFixed(2)}</td>
              <td style={{ color: h.profitLoss > 0 ? "green" : h.profitLoss < 0 ? "red" : "#007bff", fontWeight: "bold" }}>
                {h.profitLoss > 0 ? <><FaArrowUp /> ₹{h.profitLoss.toFixed(2)}</> :
                 h.profitLoss < 0 ? <><FaArrowDown /> ₹{h.profitLoss.toFixed(2)}</> :
                 <><FaMinus /> ₹0</>}
              </td>
              <td style={{ color: h.profitLossPercent > 0 ? "green" : h.profitLossPercent < 0 ? "red" : "#007bff", fontWeight: "bold" }}>
                {h.profitLossPercent > 0 ? `+${h.profitLossPercent.toFixed(2)}%` :
                 h.profitLossPercent < 0 ? `${h.profitLossPercent.toFixed(2)}%` :
                 `0%`}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton><Modal.Title>Send Portfolio</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="emailInput">
              <Form.Label>Enter email to send portfolio:</Form.Label>
              <Form.Control type="email" placeholder="example@gmail.com" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEmailSend}>Send</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

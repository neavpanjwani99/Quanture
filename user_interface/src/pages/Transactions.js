// Transactions.js
import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Card, Spinner, Alert, Button, Modal } from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import logo from "../assets/images/logo1.png";
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { API_BASE_URL } from "../config/api";

export default function Transactions() {
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Transactions – Quanture";
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  // Fetch trades from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in to view transactions.");

        const { data: trades } = await axios.get(`${API_BASE_URL}/api/trades`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = trades.map(t => ({
          symbol: t.stockName,
          type: t.tradeType.toLowerCase(),
          date: t.timestamp, // assuming Trade model has timestamp
          shares: t.quantity,
          price: t.price
        }));

        setTransactions(formatted);
      } catch (err) {
        console.error("Transactions fetch error:", err);
        setError(err.message || "Unable to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesStart = !startDate || date >= startDate;
    const matchesEnd = !endDate || date <= endDate;
    return matchesType && matchesStart && matchesEnd;
  });

  const handleDownloadCSV = () => {
    if (filteredTransactions.length === 0) return alert("No transactions to download!");
    const csv = Papa.unparse(filteredTransactions.map(t => ({
      Stock: t.symbol,
      Type: t.type,
      Date: t.date,
      Shares: t.shares,
      Price: t.price
    })));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  const handleEmailTransactions = async () => {
    if (!emailAddress) return alert("Enter email address");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to send email");

      await axios.post(
        `${API_BASE_URL}/api/trades/email-transactions`,
        { transactions: filteredTransactions, email: emailAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Transactions emailed successfully!");
      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    }
  };

  if (loading) return <Container className="text-center" style={{ padding: "2rem" }}><Spinner animation="border" /> Loading transactions...</Container>;
  if (error) return <Container style={{ padding: "2rem" }}><Alert variant="danger">{error}</Alert></Container>;
  if (transactions.length === 0) return <Container style={{ padding: "2rem" }}><Alert variant="info">No transactions found.</Alert></Container>;

  return (
    <Container style={{ padding: "2rem" }}>
      <h2 className="mb-4 text-center">Transaction History</h2>

      {/* Filters + CSV/Email Buttons */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="buy">Buys</option>
            <option value="sell">Sells</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <DatePicker selected={startDate} onChange={setStartDate} placeholderText="Start Date" className="form-control"/>
        </Col>
        <Col md={3}>
          <DatePicker selected={endDate} onChange={setEndDate} placeholderText="End Date" className="form-control"/>
        </Col>
        <Col md={3} className="d-flex gap-2">
          <Button variant="success" onClick={handleDownloadCSV}>Download CSV</Button>
          <Button variant="primary" onClick={() => setShowEmailModal(true)}><FaEnvelope /> Email</Button>
        </Col>
      </Row>

      {/* Timeline */}
      <div className="timeline">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, idx) => (
            <div
              key={idx}
              className={`timeline-item ${tx.type}`}
              onClick={() => navigate(`/stock/${tx.symbol}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="timeline-icon">
                {tx.type === "buy" ? <FaArrowUp color="green" /> : <FaArrowDown color="red" />}
              </div>
              <Card className="timeline-content">
                <Card.Body>
                  <Card.Title>{tx.symbol}</Card.Title>
                  <Card.Text>
                    {tx.type === "buy" ? "Bought" : "Sold"} {tx.shares} shares @ ₹{tx.price}  
                    <br />
                    <small>{new Date(tx.date).toDateString()}</small>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (startDate || endDate) ? (
          <Alert variant="info">No transactions available for selected date range.</Alert>
        ) : (
          <Alert variant="info">No transactions available.</Alert>
        )}
      </div>

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton><Modal.Title>Send Transactions</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Enter email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@gmail.com"
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEmailTransactions}>Send</Button>
        </Modal.Footer>
      </Modal>

      {/* Styles */}
      <style>{`
        .timeline {
          position: relative;
          margin-left: 2rem;
          padding-left: 1rem;
          border-left: 2px solid #ddd;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
          transition: transform 0.2s ease;
        }
        .timeline-item:hover {
          transform: translateX(5px);
        }
        .timeline-icon {
          position: absolute;
          left: -1.4rem;
          top: 1rem;
          background: #fff;
          border: 2px solid #ddd;
          border-radius: 50%;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-content {
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border-radius: 12px;
        }
        .timeline-item.buy .timeline-icon {
          border-color: green;
        }
        .timeline-item.sell .timeline-icon {
          border-color: red;
        }
      `}</style>
    </Container>
  );
}

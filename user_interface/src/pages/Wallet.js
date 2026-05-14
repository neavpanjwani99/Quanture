// Wallet.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  ProgressBar,
  Modal,
  Table,
  Row,
  Col
} from "react-bootstrap";
import { FaWallet } from "react-icons/fa";
import logo from "../assets/images/logo1.png";

export default function Wallet() {
  const [balance, setBalance] = useState(10000); // Initial virtual money
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAddFunds = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setLoading(true);

    setTimeout(() => {
      setBalance((prev) => prev + Number(amount));
      setTransactions([
        {
          type: "Add",
          amount: Number(amount),
          date: new Date().toLocaleString(),
        },
        ...transactions,
      ]);
      setLoading(false);
      setAmount("");
    }, 1500);
  };

   // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Wallet – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);
  
  const handleWithdraw = () => {
    if (!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > balance)
      return;

    setConfirmation(true);
    setTimeout(() => {
      setBalance((prev) => prev - Number(withdrawAmount));
      setTransactions([
        {
          type: "Withdraw",
          amount: Number(withdrawAmount),
          date: new Date().toLocaleString(),
        },
        ...transactions,
      ]);
      setConfirmation(false);
      setShowWithdrawModal(false);
      setWithdrawAmount("");
    }, 1500);
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <h2 className="text-center mb-4">Wallet Management</h2>

      {/* Wallet Card */}
      <div
        className={`wallet-card ${isFlipped ? "flipped" : ""}`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div className="wallet-front">
          <FaWallet size={40} />
          <h3>Balance: ₹{balance.toLocaleString()}</h3>
        </div>
        <div className="wallet-back">
          <h5>Transaction History</h5>
          <Table striped size="sm" style={{ fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td style={{ color: tx.type === "Add" ? "green" : "red" }}>
                      {tx.type}
                    </td>
                    <td>₹{tx.amount}</td>
                    <td>{tx.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Add & Withdraw in Same Row */}
      <Card className="p-3 mt-4">
        <Form onSubmit={handleAddFunds}>
          <Row className="align-items-center g-2">
            <Col xs={12} md={4}>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Col>
            <Col xs={6} md={4}>
              <Button
                type="submit"
                className="btn-add w-100"
                disabled={loading}
              >
                {loading ? "Processing..." : "Add Funds"}
              </Button>
            </Col>
            <Col xs={6} md={4}>
              <Button
                className="btn-withdraw w-100"
                onClick={() => setShowWithdrawModal(true)}
              >
                Withdraw
              </Button>
            </Col>
          </Row>
          {loading && <ProgressBar animated now={100} className="mt-3" />}
        </Form>
      </Card>

      {/* Withdraw Modal */}
      <Modal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmation ? (
            <div className="text-center">
              <h5>Processing Withdrawal...</h5>
              <ProgressBar animated now={100} />
            </div>
          ) : (
            <>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mb-3"
              />
              <Button
                className="btn-withdraw w-100"
                onClick={handleWithdraw}
              >
                Confirm Withdraw
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* CSS */}
      <style>{`
        .wallet-card {
          width: 300px;
          height: 200px;
          margin: auto;
          perspective: 1000px;
          cursor: pointer;
          position: relative;
        }
        .wallet-front, .wallet-back {
          width: 100%;
          height: 100%;
          position: absolute;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 15px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          padding: 1rem;
          text-align: center;
          transition: transform 0.6s ease;
        }
        .wallet-front {
          background: linear-gradient(135deg, #1f4037, #99f2c8);
          color: #fff8dc;
          font-weight: bold;
        }
        .wallet-back {
          transform: rotateY(180deg);
          background: #ffffff;
          color: #2d3436;
          overflow-y: auto;
        }
        .wallet-card.flipped .wallet-front {
          transform: rotateY(180deg);
        }
        .wallet-card.flipped .wallet-back {
          transform: rotateY(0deg);
        }
        .btn-add {
          background-color: #00b36b !important;
          border: none !important;
          color: white !important;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }
        .btn-add:hover {
          background-color: #00995c !important;
        }
        .btn-withdraw {
          background-color: #ff9966 !important;
          border: none !important;
          color: white !important;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }
        .btn-withdraw:hover {
          background-color: #e68757 !important;
        }
      `}</style>
    </Container>
  );
}

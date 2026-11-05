import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  Modal,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { API_BASE_URL } from "../config/api";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import logo from "../assets/images/logo1.png";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const initialStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 145.67, eps: 5.6 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2750.43, eps: 80 },
  { symbol: "AMZN", name: "Amazon.com", price: 3450.21, eps: 60 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 299.55, eps: 10 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 720.33, eps: 4 },
];

const API_URL = `${API_BASE_URL}/api/watchlist`;

export default function Watchlist() {
  const [stocks, setStocks] = useState(initialStocks);
  const [watchlist, setWatchlist] = useState([]);
  const [modalStock, setModalStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("buy");
  const [quantity, setQuantity] = useState(1);
  const [toasts, setToasts] = useState([]);

  const token = localStorage.getItem("token");

  // Toast helper
  const addToast = (message, type = "info") => {
    const id = new Date().getTime();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // Fetch watchlist from backend
  const fetchWatchlist = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(data);
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch watchlist", "danger");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Price fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: +(stock.price * (1 + (Math.random() - 0.5) / 50)).toFixed(2),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Favicon & title
  useEffect(() => {
    document.title = "WatchList – Quanture";
    const favicon =
      document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  // Add stock
  const handleAddStock = async (stock) => {
    if (!watchlist.find((s) => s.stockSymbol === stock.symbol)) {
      try {
        const { data } = await axios.post(
          `${API_URL}/add`,
          { stockSymbol: stock.symbol, price: stock.price, location: "Web" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWatchlist((prev) => [data, ...prev]);
        addToast(`Added ${stock.symbol} to your Watchlist!`, "success");
      } catch (err) {
        console.error(err);
        addToast("Failed to add stock", "danger");
      }
    } else {
      addToast(`${stock.symbol} is already in your Watchlist!`, "info");
    }
  };

  // Remove stock from watchlist (frontend only)
  const handleRemoveStock = (symbol) => {
    setWatchlist(watchlist.filter((s) => s.stockSymbol !== symbol));
    addToast(`Removed ${symbol} from your Watchlist!`, "danger");
  };

  // Open modal for Buy/Sell
  const handleAction = (stock, type) => {
    setModalStock(stock);
    setActionType(type);
    setQuantity(1);
    setShowModal(true);
  };

  // Confirm trade
  const handleConfirmAction = async () => {
    if (!modalStock) return;
    try {
      await axios.post(
        `${API_URL}/trade`,
        {
          stockSymbol: modalStock.stockSymbol || modalStock.symbol,
          tradeType: actionType === "buy" ? "Buy" : "Sell",
          price: modalStock.price,
          quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast(
        `${actionType.toUpperCase()} ${quantity} shares of ${modalStock.stockSymbol ||
        modalStock.symbol} at $${modalStock.price.toFixed(2)}`,
        actionType === "buy" ? "success" : "warning"
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
      addToast("Trade failed", "danger");
    }
  };

  // Pie chart data
  const pieData = {
    labels: watchlist.map((s) => s.stockSymbol),
    datasets: [
      {
        data: watchlist.map((s) => s.price),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <h2 className="mb-4 text-center">My Watchlist</h2>

      {/* Recommended stocks */}
      <Row className="mb-4">
        {stocks.map((stock) => (
          <Col md={4} key={stock.symbol} className="mb-3">
            <Card className="p-3 shadow-sm">
              <h5>{stock.name}</h5>
              <p>
                Symbol: <Badge bg="info">{stock.symbol}</Badge>
              </p>
              <p>Price: ${stock.price.toFixed(2)}</p>
              <p>PE Ratio: {(stock.price / stock.eps).toFixed(2)}</p>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleAddStock(stock)}
                className="me-2"
              >
                Add
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Watchlist */}
      <h4 className="mb-3">Your Watchlist</h4>
      {watchlist.length === 0 && <p>No stocks added yet!</p>}
      <ListGroup className="mb-4">
        {watchlist.map((stock, index) => (
          <ListGroup.Item
            key={stock._id || `${stock.stockSymbol}-${index}`}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{stock.stockSymbol}</strong> - $
              {stock.price ? stock.price.toFixed(2) : "-"} <br />
              <small>
                PE Ratio:{" "}
                {stock.price && stock.eps
                  ? (stock.price / stock.eps).toFixed(2)
                  : "-"}{" "}
                | Added at:{" "}
                {stock.addedAt
                  ? new Date(stock.addedAt).toLocaleString()
                  : "-"}
              </small>
            </div>
            <div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleAction(stock, "buy")}
                className="me-2"
              >
                Buy
              </Button>
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleAction(stock, "sell")}
                className="me-2"
              >
                Sell
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleRemoveStock(stock.stockSymbol)}
              >
                Remove
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>


      {/* Pie Chart
      {watchlist.length > 0 && (
        <div className="mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h5 className="text-center mb-3">Portfolio Composition</h5>
          <Pie data={pieData} />
        </div>
      )} */}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType.toUpperCase()} {modalStock?.stockSymbol || modalStock?.symbol}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Price per share: ${modalStock?.price?.toFixed(2) || 0}
              </Form.Label>
              <p>
                PE Ratio: {modalStock?.price && modalStock?.eps ? (modalStock.price / modalStock.eps).toFixed(2) : "-"}
              </p>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "buy" ? "success" : "warning"}
            onClick={handleConfirmAction}
          >
            Confirm {actionType.toUpperCase()}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toasts */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
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

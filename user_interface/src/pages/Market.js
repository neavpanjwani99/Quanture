import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Toast,
  Badge,
} from "react-bootstrap";
import "animate.css";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

// Chart.js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import logo from "../assets/images/logo1.png";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

/** ---------- Demo Data ---------- */
const baseData = {
  Sensex: [
    { name: "Reliance", price: 2450, change: 0.8 },
    { name: "TCS", price: 3580, change: -0.5 },
    { name: "HDFC Bank", price: 1680, change: 1.2 },
    { name: "Infosys", price: 1540, change: 0.6 },
    { name: "ICICI Bank", price: 990, change: -0.2 },
    { name: "Adani Ports", price: 1200, change: 2.1 },
    { name: "Bharti Airtel", price: 885, change: 0.7 },
    { name: "Kotak Bank", price: 1780, change: -1.1 },
    { name: "HUL", price: 2480, change: 0.4 },
    { name: "Bajaj Finance", price: 6780, change: -0.6 },
    { name: "NTPC", price: 280, change: 0.3 },
    { name: "ONGC", price: 168, change: 1.5 },
    { name: "Maruti Suzuki", price: 9550, change: 0.9 },
    { name: "Tech Mahindra", price: 1230, change: -0.4 },
    { name: "Titan", price: 3180, change: 0.8 },
  ],
  Nifty: [
    { name: "Ultratech Cement", price: 8250, change: 1.0 },
    { name: "Wipro", price: 465, change: -0.7 },
    { name: "JSW Steel", price: 765, change: 1.2 },
    { name: "Asian Paints", price: 3250, change: -0.9 },
    { name: "Coal India", price: 245, change: 0.5 },
    { name: "Power Grid", price: 272, change: 0.6 },
    { name: "Grasim", price: 1980, change: -0.3 },
    { name: "LTIMindtree", price: 5200, change: 0.4 },
  ],
  BankNifty: [
    { name: "SBI", price: 560, change: 0.4 },
    { name: "Axis Bank", price: 950, change: -0.8 },
    { name: "IndusInd Bank", price: 1380, change: 0.6 },
    { name: "Federal Bank", price: 158, change: -0.2 },
    { name: "Bandhan Bank", price: 218, change: 0.3 },
    { name: "YES Bank", price: 23, change: 1.1 },
  ],
  Midcap: [
    { name: "IRCTC", price: 760, change: 1.9 },
    { name: "BEL", price: 145, change: -0.4 },
    { name: "Zydus Life", price: 620, change: 0.6 },
    { name: "PVR Inox", price: 1575, change: 0.9 },
    { name: "Polycab", price: 5350, change: -0.5 },
  ],
  Smallcap: [
    { name: "Suzlon", price: 48, change: 2.5 },
    { name: "Borosil", price: 385, change: -1.1 },
    { name: "CESC", price: 92, change: 0.3 },
    { name: "Sterlite Tech", price: 166, change: 0.4 },
    { name: "IEX", price: 167, change: -0.7 },
  ],
};


const prettyNumber = (n) =>
  n?.toLocaleString("en-IN", { maximumFractionDigits: 2 });

/** ---------- Component ---------- */
const MarketShowcase = () => {
  const [selectedIndex, setSelectedIndex] = useState("Sensex");
  const [indicesLive, setIndicesLive] = useState({});
  const [stocksByIndex, setStocksByIndex] = useState(baseData);

  // View modal
  const [viewStock, setViewStock] = useState(null);

  // Trade modal
  const [tradeStock, setTradeStock] = useState(null);
  const [tradeType, setTradeType] = useState(""); // 'Buy' | 'Sell'
  const [order, setOrder] = useState({ price: "", qty: "", type: "Limit" });

  // Toast
  const [toast, setToast] = useState({ show: false, msg: "", variant: "success" });

  // Auto-fluctuate Indices values
  useEffect(() => {
    const tick = () => {
      const next = {};
      Object.keys(baseData).forEach((idx) => {
        const base = 50000 + Math.floor(Math.random() * 3000);
        const chg = (Math.random() * 2 - 1).toFixed(2); // -1%..+1%
        next[idx] = { value: base, change: Number(chg) };
      });
      setIndicesLive(next);
    };
    tick();
    const id = setInterval(tick, 1800);
    return () => clearInterval(id);
  }, []);

  // Light random jitter to table prices every 4s (selected index only)
  useEffect(() => {
    const id = setInterval(() => {
      setStocksByIndex((prev) => {
        const copy = { ...prev };
        copy[selectedIndex] = prev[selectedIndex].map((s) => {
          const jitter = (Math.random() * 0.8 - 0.4) * (s.price * 0.002);
          const newPrice = Math.max(1, s.price + jitter);
          const change = Number(((newPrice - s.price) / s.price) * 100).toFixed(2);
          return { ...s, price: Number(newPrice.toFixed(2)), change: Number(change) };
        });
        return copy;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [selectedIndex]);

  // Set Page Title & Favicon
  useEffect(() => {
    document.title = "Market  – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  const totalAmount = useMemo(() => {
    const p = Number(order.price || 0);
    const q = Number(order.qty || 0);
    return p > 0 && q > 0 ? p * q : 0;
  }, [order.price, order.qty]);

  const canPlace =
    tradeStock &&
    (order.type === "Market" || Number(order.price) > 0) &&
    Number(order.qty) > 0;

  /** Chart data for View modal */
  const chartData = useMemo(() => {
    if (!viewStock) return null;
    const base = viewStock.price;
    const pts = Array.from({ length: 7 }, (_, i) =>
      Math.round(base * (0.95 + Math.random() * 0.1))
    );
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: `${viewStock.name} Trend`,
          data: pts,
          borderColor: "rgba(13,110,253,1)",
          backgroundColor: "rgba(13,110,253,0.15)",
          tension: 0.35,
          fill: true,
          pointRadius: 2.5,
        },
      ],
    };
  }, [viewStock]);

  return (
    <Container
      fluid
      className="p-4"
      style={{
        background: "linear-gradient(120deg, #eef2f3, #e8eef6)",
        minHeight: "100vh",
      }}
    >
      <h2 className="mb-4 fw-bold text-center animate__animated animate__fadeInDown">
        Indian Market Dashboard
      </h2>

      {/* Index Cards */}
      <Row className="mb-4 g-3">
        {Object.keys(baseData).map((idx, i) => {
          const live = indicesLive[idx];
          const up = (live?.change || 0) >= 0;
          return (
            <Col xl={2} lg={3} md={4} sm={6} xs={12} key={idx}>
              <Card
                onClick={() => setSelectedIndex(idx)}
                className={`shadow-sm animate__animated animate__fadeInUp ${selectedIndex === idx ? "border-primary border-3" : ""
                  }`}
                style={{
                  cursor: "pointer",
                  transition: "transform .18s ease, box-shadow .18s ease",
                  background: "linear-gradient(135deg, #ffffff, #f6f7fb)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className="fw-bold mb-0">{idx}</Card.Title>
                    <Badge bg={up ? "success" : "danger"}>
                      {up ? "↑" : "↓"} {live?.change ?? "--"}%
                    </Badge>
                  </div>
                  <div className="mt-2 fs-5">
                    {prettyNumber(live?.value) || "----"}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Stocks Table */}
      <Card className="shadow animate__animated animate__fadeInUp">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">{selectedIndex} Stocks</h5>
          <small className="text-muted">
            Click View for mini chart • Buy/Sell to place bids
          </small>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Stock</th>
                <th className="text-end">Price (₹)</th>
                <th className="text-end">Change %</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocksByIndex[selectedIndex].map((stock, i) => (
                <tr key={`${stock.name}-${i}`} className="animate__animated animate__fadeInUp">
                  <td className="fw-semibold">{stock.name}</td>
                  <td className="text-end">₹{prettyNumber(stock.price)}</td>
                  <td className={`text-end ${stock.change >= 0 ? "text-success" : "text-danger"}`}>
                    {stock.change >= 0 ? "▲ " : "▼ "}
                    {Math.abs(stock.change).toFixed(2)}%
                  </td>
                  <td className="text-center">
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => setViewStock(stock)}
                    >
                      View
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setTradeStock(stock);
                        setTradeType("Buy");
                        setOrder({ price: stock.price, qty: "", type: "Limit" });
                      }}
                    >
                      Buy
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setTradeStock(stock);
                        setTradeType("Sell");
                        setOrder({ price: stock.price, qty: "", type: "Limit" });
                      }}
                    >
                      Sell
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* View Modal with Chart */}
      <Modal show={!!viewStock} onHide={() => setViewStock(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {viewStock?.name} — Snapshot
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewStock && (
            <>
              <div className="d-flex flex-wrap gap-3">
                <div><small className="text-muted">Price</small><div className="fw-bold">₹{prettyNumber(viewStock.price)}</div></div>
                <div>
                  <small className="text-muted">Change</small>
                  <div className={`fw-bold ${viewStock.change >= 0 ? "text-success" : "text-danger"}`}>
                    {viewStock.change >= 0 ? "▲" : "▼"} {Math.abs(viewStock.change)}%
                  </div>
                </div>
                <div><small className="text-muted">52W High</small><div className="fw-bold">₹{prettyNumber(viewStock.price * 1.2)}</div></div>
                <div><small className="text-muted">52W Low</small><div className="fw-bold">₹{prettyNumber(viewStock.price * 0.8)}</div></div>
              </div>

              <div className="mt-3" style={{ height: 260 }}>
                {chartData && (
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false }, tooltip: { intersect: false } },
                      scales: {
                        x: { grid: { display: false } },
                        y: { ticks: { callback: (v) => "₹" + v } },
                      },
                    }}
                  />
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewStock(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Trade Modal (Buy/Sell) */}
      <Modal show={!!tradeStock} onHide={() => setTradeStock(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {tradeType} — {tradeStock?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col sm={4}>
                <Form.Label>Order Type</Form.Label>
                <Form.Select
                  value={order.type}
                  onChange={(e) => setOrder((o) => ({ ...o, type: e.target.value }))}
                >
                  <option value="Limit">Limit</option>
                  <option value="Market">Market</option>
                </Form.Select>
              </Col>

              <Col sm={4}>
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Bid price"
                  value={order.price}
                  disabled={order.type === "Market"}
                  onChange={(e) =>
                    setOrder((o) => ({ ...o, price: e.target.value }))
                  }
                />
                {order.type === "Market" && (
                  <Form.Text muted>Market orders execute near ₹{prettyNumber(tradeStock?.price)}.</Form.Text>
                )}
              </Col>

              <Col sm={4}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Qty"
                  value={order.qty}
                  onChange={(e) =>
                    setOrder((o) => ({ ...o, qty: e.target.value }))
                  }
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-3 p-2 rounded"
              style={{ background: "#f8f9fb", border: "1px dashed #dee2e6" }}>
              <div className="small text-muted">Estimated Total</div>
              <div className="fs-5 fw-bold">₹{prettyNumber(totalAmount)}</div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setTradeStock(null)}>
            Cancel
          </Button>
          <Button
            disabled={!canPlace}
            variant={tradeType === "Buy" ? "success" : "danger"}
            onClick={async () => {
              try {
                const priceUsed =
                  order.type === "Market" ? tradeStock.price : Number(order.price);
                const qtyUsed = Number(order.qty);

                const token = localStorage.getItem("token"); // <-- ensure login saves token

                await axios.post(
                  `${API_BASE_URL}/api/trades`,
                  {
                    stockName: tradeStock.name,      // matches backend
                    tradeType,                       // "Buy" or "Sell"
                    price: priceUsed,
                    quantity: qtyUsed,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                
                setToast({
                  show: true,
                  variant: tradeType === "Buy" ? "success" : "danger",
                  msg: `${tradeType} ${tradeStock?.name} • ₹${prettyNumber(
                    priceUsed
                  )} × ${qtyUsed} = ₹${prettyNumber(priceUsed * qtyUsed)}`,
                });
                setTradeStock(null);
              } catch (err) {
                console.error("Trade Error:", err);
                setToast({
                  show: true,
                  variant: "danger",
                  msg: "Trade failed. Please try again.",
                });
              }
            }}
          >
            {tradeType}
          </Button>

        </Modal.Footer>
      </Modal>

      {/* Toast (top-right) */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
        <Toast
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          show={toast.show}
          delay={3200}
          autohide
          className={`text-white animate__animated animate__fadeInRight`}
          bg={toast.variant}
        >
          <Toast.Body className="fw-semibold">{toast.msg}</Toast.Body>
        </Toast>
      </div>

      {/* Small style polish */}
      <style>{`
        .table tbody tr:hover {
          background: rgba(13,110,253,0.04);
        }
      `}</style>
    </Container>
  );
};

export default MarketShowcase;

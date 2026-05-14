// StockDetails.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Tab,
  Nav,
} from "react-bootstrap";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import logo from "../assets/images/logo1.png";
import "animate.css";

export default function StockDetails() {
  const stockData = [
    {
      name: "Tesla Inc.",
      symbol: "TSLA",
      price: 720.55,
      change: +3.4,
      logo: "https://logo.clearbit.com/tesla.com",
      chartSeries: [600, 650, 620, 700, 670, 720, 680, 750],
    },
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      price: 145.32,
      change: -1.2,
      logo: "https://logo.clearbit.com/apple.com",
      chartSeries: [140, 150, 147, 152, 148, 155, 149, 160],
    },
    {
      name: "Microsoft Corp.",
      symbol: "MSFT",
      price: 299.1,
      change: +2.1,
      logo: "https://logo.clearbit.com/microsoft.com",
      chartSeries: [280, 290, 285, 295, 288, 300, 290, 310],
    },
    {
      name: "Amazon.com Inc.",
      symbol: "AMZN",
      price: 134.76,
      change: -0.8,
      logo: "https://logo.clearbit.com/amazon.com",
      chartSeries: [120, 130, 125, 140, 135, 138, 132, 145],
    },
    {
      name: "Alphabet Inc.",
      symbol: "GOOGL",
      price: 2725.6,
      change: +1.5,
      logo: "https://logo.clearbit.com/abc.xyz",
      chartSeries: [2600, 2650, 2630, 2700, 2680, 2730, 2710, 2750],
    },
  ];

  // Page Title & Favicon
  useEffect(() => {
    document.title = "Stock Details – Quanture";

    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = logo;
    document.head.appendChild(favicon);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stocks, setStocks] = useState(stockData);
  const stock = stocks[currentIndex];

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [bidPrice, setBidPrice] = useState("");

  // Auto Price Fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((s, i) => {
          if (i === currentIndex) {
            const randomChange = parseFloat(
              (Math.random() * 2 - 1).toFixed(2)
            );
            const basePrice = isNaN(s.price) ? 100 : s.price;
            const newPrice = parseFloat(
              (basePrice * (1 + randomChange / 100)).toFixed(2)
            );

            let newSeries = [...s.chartSeries];
            if (newSeries.length >= 8) newSeries.shift();
            newSeries.push(newPrice);

            return {
              ...s,
              price: newPrice,
              change: randomChange,
              chartSeries: newSeries,
            };
          }
          return s;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Chart Options
  const chartOptions = {
    chart: {
      id: "stock-chart",
      animations: { enabled: true, easing: "linear", speed: 1500 },
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
    yaxis: { labels: { formatter: (val) => `₹${val}` } },
    tooltip: { theme: "dark" },
  };

  const chartSeries = [
    {
      name: "Price",
      data: stock.chartSeries,
    },
  ];

  // Modal Handler
  const handleAction = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Confirm Bid
  const handleConfirm = () => {
    if (!quantity || !bidPrice) return;

    Swal.fire({
      title: `${modalType} Bid Placed `,
      html: `
        <div style="text-align:left;font-size:15px;line-height:1.6">
          <p><b>Stock:</b> ${stock.name} (${stock.symbol})</p>
          <p><b>Bid Price:</b> ₹${bidPrice}</p>
          <p><b>Quantity:</b> ${quantity}</p>
          <hr/>
          <p><b>Total:</b> ₹${(bidPrice * quantity).toLocaleString()}</p>
        </div>
      `,
      icon: modalType === "Buy" ? "success" : "warning",
      confirmButtonColor: modalType === "Buy" ? "#28a745" : "#ff4757",
      confirmButtonText: "Done ",
      background: "#fff",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });

    setShowModal(false);
    setQuantity("");
    setBidPrice("");
  };

  // Pagination
  const nextStock = () => {
    setCurrentIndex((prev) => (prev + 1) % stockData.length);
  };
  const prevStock = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? stockData.length - 1 : prev - 1
    );
  };

  return (
    <Container style={{ padding: "2rem" }}>
      {/* Stock Info Header */}
      <motion.div
        className="stock-header d-flex align-items-center justify-content-between mb-4 p-3 rounded-4 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="d-flex align-items-center">
          <img
            src={stock.logo}
            alt={stock.symbol}
            className="stock-logo me-3"
          />
          <div>
            <h3 className="mb-0">{stock.name}</h3>
            <small className="text-muted">{stock.symbol}</small>
          </div>
        </div>
        <div className="text-end">
          <h4 className="mb-0">₹{stock.price.toLocaleString()}</h4>
          <span
            style={{
              color: stock.change >= 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {stock.change > 0 ? `+${stock.change}%` : `${stock.change}%`}
          </span>
        </div>
      </motion.div>

      {/* Chart */}
      <Card className="p-3 shadow-sm mb-4">
        <h5 className="mb-3">Historical Performance</h5>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={300}
        />
      </Card>

      {/* Pagination */}
      <Row className="mb-4 text-center">
        <Col>
          <Button variant="secondary" onClick={prevStock}>
            Prev
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" onClick={nextStock}>
            Next
          </Button>
        </Col>
      </Row>

      {/* Buy / Sell Buttons */}
      <Row className="mb-4">
        <Col className="text-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              style={{
                background: "linear-gradient(135deg, #28a745, #7bed9f)",
                border: "none",
                fontWeight: "600",
                padding: "0.75rem 2rem",
              }}
              onClick={() => handleAction("Buy")}
            >
              Buy
            </Button>
          </motion.div>
        </Col>
        <Col className="text-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              style={{
                background: "linear-gradient(135deg, #ff4757, #ff6b81)",
                border: "none",
                fontWeight: "600",
                padding: "0.75rem 2rem",
              }}
              onClick={() => handleAction("Sell")}
            >
              Sell
            </Button>
          </motion.div>
        </Col>
      </Row>

      {/* Extra Info Tabs */}
      <Card className="p-3 shadow-sm rounded-4">
        <Tab.Container defaultActiveKey="profile">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="profile">Company Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="news">Latest News</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="profile">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p>
                  {stock.name} ({stock.symbol}) is one of the leading companies
                  in its sector. Known for innovation and market influence,{" "}
                  {stock.symbol} continues to shape the industry.
                </p>
              </motion.div>
            </Tab.Pane>
            <Tab.Pane eventKey="news">
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <li>{stock.symbol} announces record results</li>
                <li>New projects expected to boost growth</li>
                <li>Analysts update price targets on {stock.symbol}</li>
              </motion.ul>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card>

      {/* Buy/Sell Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        animation
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "Buy" ? "Buy Stock" : "Sell Stock"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mb-3"
            />
            <Form.Control
              type="number"
              placeholder="Enter bid price (₹)"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              className="mb-3"
            />
            <Button
              className="w-100"
              style={{
                background:
                  modalType === "Buy"
                    ? "linear-gradient(135deg, #28a745, #7bed9f)"
                    : "linear-gradient(135deg, #ff4757, #ff6b81)",
                border: "none",
                fontWeight: "600",
              }}
              onClick={handleConfirm}
            >
              Confirm {modalType}
            </Button>
          </Modal.Body>
        </motion.div>
      </Modal>

      {/* CSS */}
      <style>{`
        .stock-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
      `}</style>
    </Container>
  );
}

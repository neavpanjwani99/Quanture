// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Terms from "./pages/Terms";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import StepForm from "./pages/StepForm"; 
import Dashboard from "./pages/Dashboard";
import Home1 from "./pages/afterlogin";
import Portfolio from "./pages/portfolio";
import Transaction from "./pages/Transactions";
import Wallet from "./pages/Wallet";
import Profile from "./pages/ProfileSettings";
import Stock from "./pages/StockDetails";
import Market from "./pages/Market";
import Watchlist from "./pages/watchlist";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/step-form"||
    location.pathname === "/register"||
    location.pathname === "/terms";

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={hideLayout ? "" : "container my-5"}>
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/step-form" element={<StepForm />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home1" element={<Home1 />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/market" element={<Market />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;

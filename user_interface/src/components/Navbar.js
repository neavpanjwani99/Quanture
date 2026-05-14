import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import logo from "../assets/images/logo1.png";

export default function GlassCandleNavbar({ initialMood = "bull" }) {
  const navItems = [
    "Home",
    "Market",
    "Portfolio",
    "Watchlist",
    "About Us",
    "Profile",
  ];

  const tickers = useMemo(
    () => [
      { s: "NIFTY 50", chg: "+0.85%", up: true },
      { s: "SENSEX", chg: "-0.24%", up: false },
      { s: "RELIANCE", chg: "+1.12%", up: true },
      { s: "TCS", chg: "-0.54%", up: false },
    ],
    []
  );

  const candles = useMemo(() => {
    const arr = new Array(60).fill(0).map((_, i) => {
      const h = 6 + Math.round(Math.abs(Math.sin(i * 1.3)) * 79);
      const up = i % 3 !== 0;
      return { h, up };
    });
    return arr;
  }, []);

  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mood, setMood] = useState(initialMood);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setMood((m) => (m === "bull" ? "bear" : "bull")),
      12000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <header className="gcn-root">
      <div className="gcn-ticker" aria-hidden>
        <div className="gcn-ticker-track">
          {[0, 1].map((rep) => (
            <div className="gcn-ticker-segment" key={rep}>
              {tickers.map((t) => (
                <div className={`gcn-tick ${t.up ? "up" : "down"}`} key={t.s}>
                  <strong>{t.s}</strong>
                  <span className="gcn-tick-change">{t.chg}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav
        className={`gcn-nav ${mood === "bull" ? "mood-bull" : "mood-bear"}`}
        role="navigation"
      >
        <div className="gcn-candles" aria-hidden>
          <div className="gcn-candles-track">
            {candles.map((c, i) => (
              <div
                className={`gcn-candle ${c.up ? "c-up" : "c-down"}`}
                key={i}
                style={{ height: `${c.h}%` }}
              />
            ))}
            {candles.map((c, i) => (
              <div
                className={`gcn-candle ${c.up ? "c-up" : "c-down"}`}
                key={`r-${i}`}
                style={{ height: `${c.h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="gcn-inner">
          <div className="gcn-left">
            <div
              className="gcn-brand"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <img
                src={logo}
                alt="Logo"
                className="gcn-logo"
                style={{ width: "38px", height: "48px", objectFit: "contain" }}
              />
              <span
                className="gcn-title"
                style={{ fontWeight: "700", color: "#3E3F29" }}
              >
                QUANTURE
              </span>
              <span className="gcn-status" title="Market status" />
            </div>
          </div>

          {/* SOMIL WALI IDEA  */}
          {/* <div className="gcn-left">
            <div className="gcn-brand">
              <img
                src={logo}
                alt="Logo"
                className="gcn-logo"
                style={{ width: "24px", height: "24px", objectFit: "contain" }}
              />
              <span className="gcn-status" title="Market status" />
            </div>
          </div> */}

          <ul className="gcn-center">
            {navItems.map((item) => (
              <li
                key={item}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                className="gcn-item"
              >
                <a
                  href={
                    item === "Home"
                      ? "/home1"
                      : item === "Market"
                      ? "/market"
                      : item === "Portfolio"
                      ? "/portfolio"
                      : item === "Watchlist"
                      ? "/watchlist"
                      : item === "About Us"
                      ? "/about"
                      : item === "Profile"
                      ? "/Profile"
                      : "#"
                  }
                  className="gcn-link"
                  style={{ textDecoration: "none" }} // removes underline
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>

                {hovered === item && (
                  <div
                    className="gcn-mini"
                    role="dialog"
                    aria-label={`${item} mini chart`}
                  >
                    <div className="mini-bars">
                      {[5, 12, 32, 18, 44].map((h, i) => (
                        <div
                          className={`mini-bar ${i % 2 ? "up" : "down"}`}
                          style={{ height: `${h}%` }}
                          key={i}
                        />
                      ))}
                    </div>
                    <div className="mini-meta">
                      <div>Open: 1450</div>
                      <div>High: 1508</div>
                      <div>Close: 1492</div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="gcn-right">
            {/* search Button */}
            {/* <button
              className="icon-btn"
              title="Search"
              onClick={() => {
                setSearchOpen((s) => !s);
                setNotifOpen(false);
              }}
            >
              <FaSearch />
            </button> */}
            <button
              className="icon-btn"
              title="Notifications"
              onClick={() => {
                setNotifOpen((n) => !n);
                setSearchOpen(false);
              }}
            >
              <FaBell />
            </button>
            <a href="/home1">
              <button className="trade-btn" title="Trade">
                Trade Now
              </button>
            </a>

            <button
              className={`hamburger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="gcn-mobile">
            {navItems.map((n) => (
              <button
                key={n}
                className="gcn-mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                {n}
              </button>
            ))}
            <div className="gcn-mobile-footer">Profile • Notifications</div>
          </div>
        )}

        {/* Sliding Search Bar */}
        {/* <div className={`gcn-search-bar ${searchOpen ? "open" : ""}`}>
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            onBlur={() => setSearchOpen(false)}
          />
        </div> */}

        {/* Offcanvas Notification Panel */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: notifOpen ? "0" : "-320px",
            width: "300px",
            height: "100vh",
            background: "rgba(30,30,30,0.88)",
            backdropFilter: "blur(12px)",
            boxShadow: "-5px 0 20px rgba(0,0,0,0.4)",
            borderLeft: "2px solid rgba(255,255,255,0.08)",
            transition: "right 0.4s ease",
            zIndex: 1200,
            color: "#fff",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ fontSize: "1.2rem", margin: 0 }}>Notifications</h4>
            <button
              onClick={() => setNotifOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ff4d6d")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              ×
            </button>
          </div>

          {/* Notification List */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              overflowY: "auto",
            }}
          >
            {[
              { text: "NIFTY up by 0.85%", color: "#4ade80" },
              { text: "SENSEX down by 0.24%", color: "#f87171" },
              { text: "Reliance shares gained 1.2%", color: "#4ade80" },
              {
                text: "HDFC Bank quarterly results released",
                color: "#60a5fa",
              },
              { text: "TCS stock fell 0.5% today", color: "#f87171" },
              { text: "IT sector overall up by 1.1%", color: "#4ade80" },
              { text: "Market news update available", color: "#fbbf24" },
            ].map((notif, index) => (
              <li
                key={index}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "0.8rem",
                  borderRadius: "10px",
                  marginBottom: "0.8rem",
                  fontSize: "0.92rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0px 6px 15px rgba(0,0,0,0.4), 0 0 10px rgba(255,255,255,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>{notif.text}</span>
                <span style={{ fontWeight: "bold", color: notif.color }}>
                  •
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <style>{`
        :root{
          --base: #CADCAE;
          --text: #3E3F29;
          --cream: #F6EFD2;
        }
        .gcn-root{font-family: Inter, ui-sans-serif, system-ui;}

        /* TICKER */
        .gcn-ticker{background: rgba(202,220,174,0.85); padding:10px 0; overflow:hidden;}
        .gcn-ticker-track{display:flex; gap:36px; align-items:center; animation: ticker 14s linear infinite;}
        .gcn-ticker-segment{display:flex; gap:36px; align-items:center; padding-left:20px;}
        .gcn-tick{display:flex; gap:8px; align-items:center; font-size:13px; color:var(--text);}
        .gcn-tick.up .gcn-tick-change{color:#2ea44f;}
        .gcn-tick.down .gcn-tick-change{color:#d64545;}
        @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);} }

        /* NAV */
        .gcn-nav{position:relative; overflow:visible;}
        .gcn-inner{position:relative; display:flex; align-items:center; justify-content:space-between; padding:14px 20px;}
        .gcn-nav.mood-bull{background: linear-gradient(180deg, rgba(202,220,174,0.18), rgba(250,250,250,0.02));}
        .gcn-nav.mood-bear{background: linear-gradient(180deg, rgba(246,239,210,0.18), rgba(250,250,250,0.02));}
        .gcn-nav::before{content:""; position:absolute; inset:0; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);}
        .gcn-inner{position:relative; z-index:2;}
        .gcn-left{display:flex; align-items:center; gap:10px;}
        .gcn-logo{font-size:20px}
        .gcn-title{font-weight:700; color:var(--text); margin-left:6px}
        .gcn-status{width:10px;height:10px;border-radius:50%;background:#2ea44f;display:inline-block;margin-left:8px;box-shadow:0 0 6px rgba(46,164,79,0.25);}

        /* center nav */
        .gcn-center{display:flex; gap:18px; list-style:none; margin:0; padding:0; align-items:center}
        .gcn-item{position:relative}
        .gcn-link{background:none;border:none;color:var(--text);font-weight:600;padding:6px 8px;border-radius:6px;cursor:pointer;transition:transform .18s ease, color .18s ease}
        .gcn-link:hover{transform:translateY(-3px); color:#000}

        /* mini preview */
        .gcn-mini{position:absolute; top:48px; left:0; transform:translateY(6px); background:var(--cream); color:var(--text); padding:10px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.12); width:220px; display:flex; gap:12px; align-items:center}
        .mini-bars{display:flex; gap:6px; align-items:flex-end; height:56px}
        .mini-bar{width:10px;border-radius:2px}
        .mini-bar.up{background:#2ea44f}
        .mini-bar.down{background:#d64545}
        .mini-meta{font-size:12px; opacity:0.9}

        /* RIGHT */
        .gcn-right{display:flex; align-items:center; gap:12px}
        .icon-btn{background:transparent;border:none;font-size:18px;cursor:pointer;color:var(--text);transition:color 0.3s ease}
        .icon-btn:hover{color:#000}
        .trade-btn {
          background: #3E3F29;
          color: #fff;
          padding: 8px 14px;
          border-radius: 24px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: 
            background 0.3s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;
          box-shadow: 0 6px 12px rgba(62, 63, 41, 0.4);
        }

        .trade-btn:hover {
          background: #2a2b1b;
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(62, 63, 41, 0.6);
        }

        .trade-btn:active {
          transform: scale(0.95);
          box-shadow: 0 3px 6px rgba(62, 63, 41, 0.2);
          background: #1f2014;
        }


        /* HAMBURGER */
        .hamburger{display:none; flex-direction:column; justify-content:space-between; width:20px; height:16px; background:none; border:none; cursor:pointer; padding:0;}
        .hamburger span{display:block; height:2px; background:#3E3F29; border-radius:1px; transition:all 0.3s ease;}
        .hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px, 5px);}
        .hamburger.open span:nth-child(2){opacity:0;}
        .hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px, -5px);}

        /* MOBILE MENU */
        @media (max-width: 768px){
          .hamburger{display:flex;}
          .gcn-center{display:none;}
          .gcn-mobile{position:absolute; top:60px; right:0; background:var(--cream); border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.15); padding:16px; display:flex; flex-direction:column; gap:14px; width:160px; z-index:5;}
          .gcn-mobile-item{background:none;border:none; font-weight:600; padding:8px; text-align:left; cursor:pointer; color:var(--text);}
          .gcn-mobile-footer{margin-top:12px; font-size:14px; color:var(--text);}
        }

        /* CANDLES */
        .gcn-candles{position:absolute; top:100%; left:0; width:100%; height:40px; overflow:hidden; opacity:0.1; user-select:none; pointer-events:none; z-index:0;}
        .gcn-candles-track{display:flex; gap:4px; animation: candle-scroll 16s linear infinite;}
        .gcn-candle{width:3px; border-radius:1px; background:#3E3F29; transform-origin:bottom;}
        .c-up{background:#2ea44f;}
        .c-down{background:#d64545;}
        @keyframes candle-scroll{0%{transform:translateX(0)} 100%{transform:translateX(-50%)}}

        /* SEARCH BAR SLIDE */
        .gcn-search-bar {
          position: absolute;
          top: 100%;
          right: 50px;
          width: 280px;
          max-width: 80vw;
          transform: translateX(100%);
          opacity: 0;
          transition: transform 0.35s ease, opacity 0.35s ease;
          background: rgba(250,250,250,0.85);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 8px 14px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          z-index: 10;
        }
        .gcn-search-bar.open {
          transform: translateX(0);
          opacity: 1;
        }
        .gcn-search-bar input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 16px;
          background: transparent;
          color: var(--text);
        }

        /* OFFCANVAS NOTIFICATIONS */
        .gcn-offcanvas {
          position: fixed;
          top: 60px;
          right: -320px;
          width: 280px;
          max-width: 80vw;
          height: calc(100vh - 60px);
          background: rgba(250,250,250,0.9);
          backdrop-filter: blur(12px);
          border-radius: 8px 0 0 8px;
          box-shadow: -4px 0 16px rgba(0,0,0,0.15);
          padding: 20px;
          box-sizing: border-box;
          transition: right 0.4s ease;
          z-index: 15;
          overflow-y: auto;
        }
        .gcn-offcanvas.open {
          right: 0;
        }
        .gcn-offcanvas h4 {
          margin-top: 0;
          font-weight: 700;
          color: var(--text);
        }
        .gcn-offcanvas ul {
          list-style: none;
          padding: 0;
          margin: 16px 0;
          color: var(--text);
          font-size: 14px;
        }
        .gcn-offcanvas button {
          background: #3E3F29;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
        }
        .gcn-offcanvas button:hover {
          background: #2a2b1b;
        }

        .gcn-search-bar {
          box-sizing: border-box;
        }

        @media (max-width: 400px) {
          .gcn-search-bar {
            right: 10px;
            width: 90vw;
            max-width: none;
          }
        }

       
        

       
      `}</style>
    </header>
  );
}

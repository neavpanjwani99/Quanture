import React from "react";
import logo from "../assets/images/logo.png";

const Footer = () => {
  const linkStyle = {
    color: "#5A7A4A", // lighter green font color for links
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.3s, text-decoration 0.3s",
    textAlign: "center",
  };

  const linkHoverStyle = {
    color: "#7BAA4F", // brighter green on hover
    textDecoration: "underline",
  };

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const pages = [
    { name: "Home", href: "/home1" },
    { name: "Transactions", href: "/transaction" },
    { name: "Wallet", href: "/wallet" },
    { name: "Stocks", href: "/stock" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#DFF2C2",
        color: "#5A7A4A", // lighter green font color overall
        padding: "30px 40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          paddingBottom: "20px",
          borderBottom: "1px solid #a9c48f",
        }}
      >
        {/* Left side: Page navigation with heading + links center aligned */}
        <div
          style={{
            flex: "1",
            minWidth: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // center align heading + links horizontally
            paddingLeft: "10px",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            QUICK LINKS
          </h3>
          <nav style={{ width: "100%", maxWidth: "150px" }}>
            {pages.map((page, i) => (
              <a
                key={page.name}
                href={page.href}
                style={
                  hoveredIndex === i
                    ? { ...linkStyle, ...linkHoverStyle }
                    : linkStyle
                }
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {page.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Middle side: Logo + company name - center aligned */}
        <div
          style={{
            flex: "1",
            minWidth: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="QUANTURE"
            style={{ width: "10rem", height: "8rem", marginBottom: "10px" }}
          />
          {/* <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            QUANTURE
          </span> */}
        </div>

        {/* Right side: Contacts */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div>
            <h3 style={{ fontWeight: "600", marginBottom: "12px" }}>
              CONTACTS
            </h3>
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
                fontSize: "0.85rem",
                lineHeight: "1.6",
              }}
            >
              <li>
                - Quanture Share Market App, Tech Park, Sector 21, Bengaluru,
                Karnataka, India
              </li>
              <li>- Quantureinfo@GMAIL.COM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div
        style={{
          marginTop: "15px",
          fontSize: "0.8rem",
          opacity: 0.8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          color: "#5A7A4A",
        }}
      >
        <span>
          © 2025 QUANTURE - DEVELOPED BY{" "}
          <a
            href="https://veenainfotech.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#5A7A4A", textDecoration: "underline" }}
          >
            NEAV PANJWANI
          </a>
        </span>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            backgroundColor: "#7BAA4F",
            border: "none",
            borderRadius: "5px",
            color: "#DFF2C2",
            padding: "5px 10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            marginTop: "10px",
          }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;

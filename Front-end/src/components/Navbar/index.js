import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#F3F3F3" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white heading-section" to="/">
          School Dashboard
        </Link>
        
        {/* Toggle button for responsive collapse */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Responsive links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link
              className={`nav-link btn ${location.pathname === "/" ? "btn-styling" : "btn-secondary"} ms-lg-2`}
              to="/"
            >
              Dashboard
            </Link>
            <Link
              className={`nav-link btn ${location.pathname.startsWith("/school-transactions") ? "btn-styling" : "btn-secondary"} ms-lg-2`}
              to="/school-transactions/1"
            >
              School Transactions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

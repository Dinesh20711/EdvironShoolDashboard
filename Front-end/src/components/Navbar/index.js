import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"
const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white heading-section" to="/" >
          School Dashboard
        </Link>
        
        {/* Add Links to DashboardPage and SchoolTransactionsComponent */}
        <div className="d-flex">
          <Link
            className={`btn ${location.pathname === '/' ? 'btn-styling' : 'btn-secondary'} ms-2`}
            to="/"
          >
            Dashboard
          </Link>

          <Link
            className={`btn ${location.pathname.startsWith('/school-transactions') ? 'btn-styling' : 'btn-secondary'} ms-2`}
            to="/school-transactions/1" 
          >
            School Transactions
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

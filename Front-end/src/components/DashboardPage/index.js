import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import AddStatusComponent from "../AddStatusComponent";
import axios from "axios";

const DashboardPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [originalTransactions, setOriginalTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("https://edviron-shool-dashboard-server.vercel.app/transactions");
        setTransactions(response.data);
        setOriginalTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const filterStatusField = (event) => {
    const statusValue = event.target.value;
    setStatusFilter(statusValue);

    let filteredTransactions = originalTransactions;

    if (statusValue) {
      filteredTransactions = filteredTransactions.filter((eachItem) =>
        eachItem.status.toLowerCase().includes(statusValue.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filteredTransactions = filteredTransactions.filter((eachItem) => {
        const transactionDate = new Date(eachItem.date_time);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    } else if (startDate) {
      filteredTransactions = filteredTransactions.filter((eachItem) => {
        const transactionDate = new Date(eachItem.date_time);
        const start = new Date(startDate);
        return transactionDate >= start;
      });
    } else if (endDate) {
      filteredTransactions = filteredTransactions.filter((eachItem) => {
        const transactionDate = new Date(eachItem.date_time);
        const end = new Date(endDate);
        return transactionDate <= end;
      });
    }

    setTransactions(filteredTransactions);
    setPage(0); // Reset page 
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowClick = (schoolId) => {
    navigate(`/school-transactions/${schoolId}`);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  
  
  const handleStatusUpdate = (transactionId, newStatus) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.custom_order_id === transactionId
        ? { ...transaction, status: newStatus }
        : transaction
    );
    setTransactions(updatedTransactions);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning text-dark";
      case "failure":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <div className="dashboard-container p-4">
      <div className="container my-4">
        <h1 className="text-center mb-4 text-secondary fw-bold">Transaction History</h1>

        <div className="row mb-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label text-secondary fw-bold">Filter By Status</label>
            <select
              className="form-select border-secondary"
              value={statusFilter}
              onChange={filterStatusField}
            >
              <option value="">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failure">Failure</option>
            </select>
          </div>
          

          <div className="col-md-3">
            <label className="form-label text-secondary fw-bold">Start Date</label>
            <input
              type="date"
              className="form-control border-secondary"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-secondary fw-bold">End Date</label>
            <input
              type="date"
              className="form-control border-secondary"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <AddStatusComponent onStatusUpdate={handleStatusUpdate} />
          </div>
        </div>

        <table className="table table-hover table-bordered">
          <thead className="table-primary">
            <tr >
              <th className="heading-section">SI No</th>
              <th className="heading-section">Institute Name</th>
              <th className="heading-section">Date & Time</th>
              <th className="heading-section">Collect ID</th>
              <th className="heading-section">School ID</th>
              <th className="heading-section">Gateway</th>
              <th className="heading-section">Order Amount</th>
              <th className="heading-section">Transaction Amount</th>
              <th className="heading-section">Status</th>
              <th className="heading-section">Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr
                key={transaction.collect_id}
                onClick={() => handleRowClick(transaction.school_id)}
                className="table-row"
              >
                <td>{page * rowsPerPage + index + 1}</td>
                <td>{transaction.institute_name}</td>
                <td>{transaction.date_time || "N/A"}</td>
                <td>{transaction.collect_id}</td>
                <td>{transaction.school_id}</td>
                <td>{transaction.gateway}</td>
                <td className="text-success">₹{transaction.order_amount}</td>
                <td className="text-primary">₹{transaction.transaction_amount}</td>
                <td>
                  <span className={getStatusClass(transaction.status)}>
                    {transaction.status}
                  </span>
                </td>
                <td>{transaction.custom_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold">
            Showing {page * rowsPerPage + 1} to {" "}
            {Math.min((page + 1) * rowsPerPage, transactions.length)} of {" "}
            {transactions.length} entries
          </span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 0}
              onClick={() => handleChangePage(page - 1)}
            >
              Previous
            </button>
            <div className="d-flex gap-2">
              {[...Array(totalPages).keys()].map((index) => (
                <button
                  key={index}
                  className={`btn ${page === index ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setPage(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages - 1}
              onClick={() => handleChangePage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

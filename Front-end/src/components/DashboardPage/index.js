import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import AddStatusComponent from "../AddStatusComponent";
import axios from "axios";

const DashboardPage = () => {
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          "https://edviron-shool-dashboard-server.vercel.app/transactions"
        );
        setAllTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactionData();
  }, []);

  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);

    let updatedTransactions = allTransactions;

    if (selectedStatus) {
      updatedTransactions = updatedTransactions.filter((transaction) =>
        transaction.status.toLowerCase().includes(selectedStatus.toLowerCase())
      );
    }

    if (filterStartDate && filterEndDate) {
      updatedTransactions = updatedTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date_time);
        const startDate = new Date(filterStartDate);
        const endDate = new Date(filterEndDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } else if (filterStartDate) {
      updatedTransactions = updatedTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date_time);
        const startDate = new Date(filterStartDate);
        return transactionDate >= startDate;
      });
    } else if (filterEndDate) {
      updatedTransactions = updatedTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date_time);
        const endDate = new Date(filterEndDate);
        return transactionDate <= endDate;
      });
    }

    setFilteredTransactions(updatedTransactions);
    setCurrentPage(0); // Reset to the first page
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTransactionRowClick = (schoolId) => {
    navigate(`/school-transactions/${schoolId}`);
  };

  const handleTransactionStatusUpdate = (transactionId, newStatus) => {
    const updatedTransactions = filteredTransactions.map((transaction) =>
      transaction.custom_order_id === transactionId
        ? { ...transaction, status: newStatus }
        : transaction
    );
    setFilteredTransactions(updatedTransactions);
  };

  const getStatusBadgeClass = (status) => {
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

  const paginatedTransactions = filteredTransactions.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  return (
    <div className="dashboard-container p-4">
      <div className="container my-4">
        <h1 className="text-center mb-4 text-secondary fw-bold">
          Transaction History
        </h1>

        <div className="row mb-3 align-items-end">
          <div className="col-md-3 col-sm-6 mb-3">
            <label className="form-label text-secondary fw-bold">
              Filter By Status
            </label>
            <select
              className="form-select border-secondary"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failure">Failure</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6 mb-3">
            <label className="form-label text-secondary fw-bold">
              Start Date
            </label>
            <input
              type="date"
              className="form-control border-secondary"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 col-sm-6 mb-3">
            <label className="form-label text-secondary fw-bold">
              End Date
            </label>
            <input
              type="date"
              className="form-control border-secondary"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 col-sm-6 mb-3">
            <AddStatusComponent onStatusUpdate={handleTransactionStatusUpdate} />
          </div>
        </div>
        <div className="table-responsive">

        <table className="table table-hover table-bordered">
          <thead className="table-primary">
            <tr>
              <th>SI No</th>
              <th>Institute Name</th>
              <th>Date & Time</th>
              <th>Collect ID</th>
              <th>School ID</th>
              <th>Gateway</th>
              <th>Order Amount</th>
              <th>Transaction Amount</th>
              <th>Status</th>
              <th>Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr
                key={transaction.collect_id}
                onClick={() =>
                  handleTransactionRowClick(transaction.school_id)
                }
                className="table-row"
              >
                <td>{currentPage * rowsPerPage + index + 1}</td>
                <td>{transaction.institute_name}</td>
                <td>{transaction.date_time || "N/A"}</td>
                <td>{transaction.collect_id}</td>
                <td>{transaction.school_id}</td>
                <td>{transaction.gateway}</td>
                <td className="text-success">₹{transaction.order_amount}</td>
                <td className="text-primary">₹{transaction.transaction_amount}</td>
                <td>
                  <span className={getStatusBadgeClass(transaction.status)}>
                    {transaction.status}
                  </span>
                </td>
                <td>{transaction.custom_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold">
            Showing {currentPage * rowsPerPage + 1} to{" "}
            {Math.min(
              (currentPage + 1) * rowsPerPage,
              filteredTransactions.length
            )}{" "}
            of {filteredTransactions.length} entries
          </span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((index) => (
              <button
                key={index}
                className={`btn ${
                  currentPage === index
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-outline-secondary"
              disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
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

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

const SchoolTransactionsComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Fetch all school IDs on mount
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const response = await fetch('https://edviron-shool-dashboard-server.vercel.app/transactions'); // Replace with your API
        const data = await response.json();
        setTransactions(data);
        // Map schools to react-select format
        const options = data.map((school) => ({
          value: school.school_id,
          label: school.institute_name,
        }));
        setSchoolOptions(options);
        setLoadingSchools(false);
      } catch (error) {
        console.error('Error fetching school IDs:', error);
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  // Fetch transactions based on selected school
  useEffect(() => {
    if (selectedSchool) {
      const fetchTransactions = async () => {
        setLoading(true);
        try {
          const response = await fetch(`https://edviron-shool-dashboard-server.vercel.app/transaction/${selectedSchool.value}`);
          const data = await response.json();
          setTransactions(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setLoading(false);
        }
      };

      fetchTransactions();
    }
  }, [selectedSchool]);

  // Styling function for status
  const getStatusBadge = (status) => {
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">School Transactions</h1>

      {/* Searchable Dropdown */}
      <div className="mb-4">
        {loadingSchools ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Select
            options={schoolOptions}
            value={selectedSchool}
            onChange={setSelectedSchool}
            placeholder="Search and select a school"
            isSearchable
          />
        )}
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">SI No</th>
                <th scope="col">Collect ID</th>
                <th scope="col">Gateway</th>
                <th scope="col">Transaction Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={transaction.collect_id}>
                    <td>{index + 1}</td>
                    <td>{transaction.collect_id}</td>
                    <td>{transaction.gateway}</td>
                    <td>{transaction.transaction_amount}</td>
                    <td>
                      <span className={getStatusBadge(transaction.status)}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SchoolTransactionsComponent;

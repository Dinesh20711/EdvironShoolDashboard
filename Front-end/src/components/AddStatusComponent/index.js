import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AddStatusComponent = ({ onStatusUpdate }) => { // Accept the onStatusUpdate function as a prop
  const [open, setOpen] = useState(false);
  const [customOrderId, setCustomOrderId] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState("");
  const [error, setError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckStatus = async () => {
    try {
      const response = await axios.post(
        "https://edviron-shool-dashboard-server.vercel.app/transaction-status-check",
        { custom_order_id: customOrderId }
      );
      
      console.log(response.data[0].status)
      setTransactionStatus(response.data[0].status);
      
    } catch (err) {
      setTransactionStatus(null);
      setError("Error fetching transaction status. Please try again.");
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.post(
        "https://edviron-shool-dashboard-server.vercel.app/update-transaction-status",
        { custom_order_id: customOrderId, status: statusToUpdate.toUpperCase() }
      );
      setError(null);
      setTransactionStatus(statusToUpdate); // Update the local state with the new status

      // Call the onStatusUpdate function passed from the parent component to update the transaction status in the parent
      onStatusUpdate(customOrderId, statusToUpdate.toUpperCase());
    } catch (err) {
      setError("Error updating transaction status. Please try again.");
    }
  };

  return (
    <div >
      <button
        className="btn btn-secondary"
        onClick={handleOpen}
      >
        Check and Update Transaction Status
      </button>

      {open && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Check and Update Transaction Status
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                {/* Check Status Section */}
                <div className="mb-3">
                  <label htmlFor="customOrderId" className="form-label">
                    Enter Custom Order ID
                  </label>
                  <input
                    type="text"
                    id="customOrderId"
                    className="form-control"
                    value={customOrderId}
                    onChange={(e) => setCustomOrderId(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleCheckStatus}
                >
                  Check Status
                </button>

                {transactionStatus && (
                  <div className="alert alert-info mt-3" role="alert">
                    <strong>Status:</strong> {transactionStatus}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {/* Update Status Section */}
                <div className="mt-4">
                  <label htmlFor="statusSelect" className="form-label">
                    Update Status
                  </label>
                  <select
                    id="statusSelect"
                    className="form-select"
                    value={statusToUpdate}
                    onChange={(e) => setStatusToUpdate(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failure">Failure</option>
                  </select>
                </div>
                <button
                  className="btn btn-secondary w-100 mt-3"
                  onClick={handleUpdateStatus}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStatusComponent;

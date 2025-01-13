Dashboard Page - Project Documentation

Overview

The DashboardPage component provides a dynamic and responsive interface for displaying and managing transaction history. It includes filtering options based on status and date, paginated transaction listings, and status updates. This page is styled using Bootstrap and custom CSS.

Features

Transaction History Table: Displays transaction details in a tabular format.

Filters:

Filter transactions by status (Success, Pending, Failure).

Filter transactions by start and end date.

Pagination: Enables navigation through multiple pages of transaction records.

Status Update: Allows updating the transaction status via the AddStatusComponent.

Clickable Rows: Navigates to the school-specific transaction page on row click.

Responsive Design: Built with Bootstrap for responsiveness.

Technologies Used

React.js

Bootstrap for UI styling

Axios for API calls

React Router for navigation

Custom CSS

Setup and Installation

Clone the repository:

git clone <repository_url>

Navigate to the project directory:

cd Frontend

Install the dependencies:

npm install

Start the development server:

npm start

Access the application in your browser at https://edviron-shool-dashboard-server.vercel.app.

API Endpoint

The transaction data is fetched from:

https://edviron-shool-dashboard-server.vercel.app/transactions

Component Structure

DashboardPage

State Variables:

filterStartDate: Tracks the start date for filtering transactions.

filterEndDate: Tracks the end date for filtering transactions.

allTransactions: Holds all transaction records fetched from the API.

filteredTransactions: Stores the filtered transaction records.

statusFilter: Tracks the selected status filter.

currentPage: Tracks the current page for pagination.

rowsPerPage: Number of rows displayed per page.

Key Functions:

fetchTransactionData: Fetches transaction data from the API.

handleStatusFilterChange: Updates the status filter and applies filtering logic.

handlePageChange: Updates the current page for pagination.

handleTransactionRowClick: Navigates to the school-specific transactions page.

handleTransactionStatusUpdate: Updates the status of a specific transaction.

getStatusBadgeClass: Returns the appropriate badge class for a transaction status.

How It Works

Fetching Data:

On initial render, the useEffect hook fetches transaction data from the API and populates allTransactions and filteredTransactions.

Filtering Transactions:

Filters transactions by status, start date, and end date using the handleStatusFilterChange function.

Pagination:

Splits transactions into pages based on the rowsPerPage value.

Updating Status:

The AddStatusComponent is used to update the transaction status dynamically.

Navigation:

Clicking on a table row navigates to the respective school transactions page.

Folder Structure

src/
├── components/
│   └── AddStatusComponent.js
├── pages/
│   └── DashboardPage.js
├── index.css
├── App.js
├── index.js

Table Columns

SI No: Serial number of the transaction.

Institute Name: Name of the institute.

Date & Time: Timestamp of the transaction.

Collect ID: Unique identifier for the collection.

School ID: Identifier for the school.

Gateway: Payment gateway used.

Order Amount: Original order amount.

Transaction Amount: Final transaction amount.

Status: Status of the transaction (Success, Pending, Failure).

Custom Order ID: Unique order identifier.

How to Extend

Add More Filters: Extend the handleStatusFilterChange function to include additional filtering criteria.

Enhance UI: Use additional Bootstrap classes or custom CSS for better styling.

API Integration: Update the API endpoint to fetch data from a different server or add more endpoints for additional features.


Acknowledgments

Bootstrap for UI components.

React Router for seamless navigation.

Axios for simplifying HTTP requests.




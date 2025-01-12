import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './components/DashboardPage';
import SchoolTransactionsComponent from './components/SchoolTransactionsComponent';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        
        <Route path="/" element={<DashboardPage />} />
        <Route exact path="/school-transactions/:id" element={<SchoolTransactionsComponent/>} />
        
      </Routes>
    </Router>
  );
}

export default App;

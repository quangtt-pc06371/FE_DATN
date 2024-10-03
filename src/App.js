import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarAdmin from './components/pages/admin/NavbarAdmin';
import CategoryManagement from './components/pages/admin/CategoryManagement';
import ProductApproval from './components/pages/admin/ProductApproval';

function App() {
  return (
    <Router>
      <NavbarAdmin />
      <Routes>
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/product-approval" element={<ProductApproval />} />
        <Route path="/" element={<CategoryManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

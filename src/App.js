import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './component/Cart';  // trang giỏ hàng
import LoginPage from './Login';  // trang đăng nhập
import Index from './component/index';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <Router>  {/* Đây là Router duy nhất */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/diachi" element={<Index />} />
      </Routes>
    </Router>
  );
};

export default App;

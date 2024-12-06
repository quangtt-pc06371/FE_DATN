import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarAdmin from './components/pages/admin/NavbarAdmin';
import CategoryManagement from './components/pages/admin/CategoryManagement';
import ShopApproval from './components/pages/admin/ShopApproval';
import ShopManagement from './components/pages/admin/ShopManagement';
import ShopRegistration from './components/pages/user/ShopRegistration';

import DangKy from "./components/compoments/Addtaikhoan";
import Profile from "./components/pages/Profile/index";
import Login from "./components/pages/Login";
import VoucherForm from './components/pages/voucherbill/VoucherForm';
import VoucherList from './components/pages/voucherbill/VoucherList';
import ThongKe from './components/pages/thongke/ThongKe';



function App() {
  return (
    <Router>
      <NavbarAdmin />
      <Routes>
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/shop-approval" element={<ShopApproval />} />
        <Route path="/" element={<CategoryManagement />} />
        <Route path="/shop-management" element={<ShopManagement />} />
        <Route path="/shop-register" element={<ShopRegistration />} />

        <Route path="/voucher" element={<VoucherForm />} />
        <Route path="/voucher-list" element={<VoucherList />} /> 

        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dangky" element={<DangKy />} />

        {/* Route cho Thống kê */}
        <Route path="/thongke" element={<ThongKe />} />
      </Routes>
    </Router>
  );
}

export default App;

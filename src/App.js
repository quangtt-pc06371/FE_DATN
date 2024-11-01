import React,{ useEffect }  from 'react';

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
import Cookies from 'js-cookie';
 import { refreshToken } from './components/pages/Refresh';
// import Dangnhap from "./components/pages/Login/App";
function App() {
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expires = Cookies.get('token');
      if (!expires) return true; // Nếu không có thời gian hết hạn, cần làm mới token

      const now = new Date();
      return now >= new Date(expires); // Kiểm tra nếu token đã hết hạn
    };

    // Thiết lập để tự động làm mới token mỗi 2 phút (120000 ms)
    const interval = setInterval(() => {
      if (checkTokenExpiry()) {
        refreshToken().catch(error => {
          console.error('Làm mới token thất bại:', error);
          window.location.href = '/login'; // Điều hướng người dùng đến trang đăng nhập
        });
      }
    }, 2 * 60 * 1000); // 2 phút

    // Dọn dẹp khi component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    
    <Router>
      
      <NavbarAdmin />
      
      <Routes>
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/shop-approval" element={<ShopApproval />} />
        <Route path="/" element={<CategoryManagement />} />
        <Route path="/shop-management" element={<ShopManagement />} />
        <Route path="/shop-register" element={<ShopRegistration />} />
        {/* <Route path="app" element={<Dangnhap/>} /> */}
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dangky" element={<DangKy />} />
      </Routes>

    </Router>
  );
}

export default App;

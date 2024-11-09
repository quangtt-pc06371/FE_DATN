import React,{ useEffect }  from 'react';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarAdmin from './components/pages/admin/NavbarAdmin';
import CategoryManagement from './components/pages/admin/CategoryManagement';
import ShopApproval from './components/pages/admin/ShopApproval';
import ShopManagement from './components/pages/admin/ShopManagement';

import ShopRegistration from './components/pages/user/ShopRegistration';
import ShopUser from './components/pages/user/ShopUser';

import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile/index";
import Login from "./components/pages/Login";
 import Updateuser2 from './components/compoments/updatetaikhoan';
 import Listtk from './components/compoments/Listtaikhoan';
 import Registergg from "./components/pages/logingoogle";
 import Index from "./components/pages/TrangChu";
//  import {YourComponent} from './components/pages/Refe';
 
 import { startTokenRefreshInterval } from "./components/pages/Refresh";

// import Dangnhap from "./components/pages/Login/App";
function App() {
  // useEffect(() => {
  //   const checkTokenExpiry = () => {
  //     const token = Cookies.get('token');
  //     if (token==null) {
  //       console.error("Không tìm thấy token trong cookie.");
  //       return true; // Nếu không có token, cần làm mới
  //     }
    
  //     try {
  //       const decoded = jwtDecode(token); // Sử dụng jwtDecode thay vì jwt_decode
  //       const now = Date.now() / 1000; // Lấy thời gian hiện tại tính bằng giây
    
  //       return decoded.exp ? now >= decoded.exp : true; // Kiểm tra nếu token đã hết hạn
  //     } catch (error) {
  //       console.error("Lỗi khi giải mã token:", error);
  //       return true; // Nếu lỗi khi giải mã, cần làm mới token
  //     }
  //   };
  //   const refreshToken = async () => {
  //     const refreshToken = Cookies.get('refreshToken');
  //     if (!refreshToken) {
  //       console.error('Không tìm thấy refresh token');
  //       return;
  //     }
    
  //     try {
  //       const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
  //       const newAccessToken = response.data.token;
    
  //       // Cập nhật access token mới vào cookie, với thời gian hết hạn là 1 ngày
  //       Cookies.set('token', newAccessToken, { expires: 1 });
  //       console.log("Token đã được làm mới thành công");
  //     } catch (error) {
  //       console.error("Làm mới token thất bại:", error);
  //       // Điều hướng người dùng đến trang đăng nhập nếu token không thể làm mới
  //       window.location.href = '/login';
  //     }
  //   };
  //   // Thiết lập để tự động làm mới token mỗi 2 phút (120000 ms)
  //   const interval = setInterval(() => {
  //     if (checkTokenExpiry()) {
  //       refreshToken().catch(error => {
  //         console.error('Làm mới token thất bại:', error);
  //         window.location.href = '/login'; // Điều hướng người dùng đến trang đăng nhập
  //       });
  //     }
  //   }, 1 * 60 * 1000); // 2 phút

  //   // // // Dọn dẹp khi component unmount
  //   return () => clearInterval(interval);

  //   // startTokenRefreshInterval();
  //   // YourComponent();
  // }, []);

  return (
    
    <Router>
      
      <NavbarAdmin />
      
      <Routes>
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/shop-approval" element={<ShopApproval />} />
        <Route path="/" element={<Index />} />
        <Route path="/shop-management" element={<ShopManagement />} />

        <Route path="/shop-register" element={<ShopRegistration />} />

        <Route path="/shop-user" element={<ShopUser />} />


        {/* <Route path="app" element={<Dangnhap/>} /> */}
        <Route path="login" element={<Login />} />
       
        <Route path="listtaikhoan" element={<Listtk />} />
        <Route path="updateuser" element={<Updateuser2 />} />
        <Route path="profile" element={<Profile/>} />
        <Route path="register" element={<Register/>} />
        <Route path="registergg" element={<Registergg/>} />
      </Routes>

    </Router>
  );
}

export default App;

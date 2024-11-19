import React, { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './App.css';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'



import NavbarAdmin from './components/pages/admin/NavbarAdmin';
import CategoryManagement from './components/pages/admin/CategoryManagement';
import ShopApproval from './components/pages/admin/ShopApproval';
import ShopManagement from './components/pages/admin/ShopManagement';

import ShopRegistration from './components/pages/user/ShopRegistration';
import ShopUser from './components/pages/user/ShopUser';


import Profile from "./components/pages/Profile/index";
import Login from "./components/pages/Login";
import TrangChu from "./components/pages/TrangChu";
import SanPham from './components/pages/Sanpham';
import ChiTietSanPham from './components/pages/Chitietsanpham';
import QuanLykhuyenMai from './components/pages/Quanlykhuyenmai';
import DanhSachkhuyenMai from './components/pages/Danhsachkhuyenmai';
import QuanlySanPham from './components/pages/Quanlysanpham';
import DanhSachSanPham from './components/pages/Danhsachsanpham';
import DanhSachSanPhamKM from './components/pages/Danhsachchuongtrinhkm';
import QuanLySanPhamKhuyenMai from './components/pages/Quanlysanphamkhuyenmai';
import Admin from "./components/pages/admin/NavbarAdmin";
import Register from "./components/pages/Register";
import Updateuser2 from './components/compoments/updatetaikhoan';
import Listtk from './components/compoments/Listtaikhoan';
import Registergg from "./components/pages/logingoogle";
 import Index from "./components/pages/TrangChu";



import { startTokenRefreshInterval } from "./components/pages/Refresh";


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<TrangChu />}>
          <Route path="/category-management" element={<CategoryManagement />} />
          <Route path="/shop-approval" element={<ShopApproval />} />
          <Route path="/category" element={<CategoryManagement />} />
          <Route path="/shop-management" element={<ShopManagement />} />

          <Route path="/shop-register" element={<ShopRegistration />} />

          <Route path="/shopuser" element={<ShopUser />} />

          <Route path='/' element={<SanPham />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/chitietsanpham/:id' element={<ChiTietSanPham />} />

          {/* <Route path="app" element={<Dangnhap/>} /> */}
          <Route path="login" element={<Login />} />

          <Route path="listtaikhoan" element={<Listtk />} />
          <Route path="updateuser" element={<Updateuser2 />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="registergg" element={<Registergg />} />

          <Route path='/quanlysanpham' element={<QuanlySanPham />} />
          <Route path='/sanpham/:idSanPham' element={<QuanlySanPham />} />
          <Route path='/danhsachsanpham' element={<DanhSachSanPham />} />
          <Route path='/danhsachsanphamkhuyenmai' element={<DanhSachSanPhamKM />} />

          <Route path='/sanphamkhuyenmai' element={<QuanLySanPhamKhuyenMai />} />
          <Route path='/sanphamkhuyenmai/:idSanPhamKhuyenMai' element={<QuanLySanPhamKhuyenMai />} />
          <Route path="/quanlykhuyenmai" element={<QuanLykhuyenMai />} />
          <Route path='/quanlykhuyenmai/:idKhuyenMai' element={<QuanLykhuyenMai />} />
          <Route path='/danhsachkhuyenmai' element={<DanhSachkhuyenMai />} />
        </Route>




      </Route>
    )
  );


  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

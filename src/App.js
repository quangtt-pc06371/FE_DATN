import React from 'react';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import './App.css'; // Đảm bảo đường dẫn đến file CSS chính xác

import TrangChu from "./components/pages/TrangChu";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile/index";
import SanPham from './components/pages/Sanpham';

import CategoryManagement from './components/pages/admin/DanhMuc/CategoryManagement';
import ShopApproval from './components/pages/admin/DuyetShop/ShopApproval';
import ShopManagement from './components/pages/admin/QuanLyShop/ShopManagement';

import AdminLayout from './components/layouts/AdminLayout';
import ShopRegistration from './components/pages/user/ShopRegistration';
import ShopUser from './components/pages/user/ShopUser';
import ChiTietSanPham from './components/pages/Chitietsanpham';
import QuanLykhuyenMai from './components/pages/Quanlykhuyenmai';
import DanhSachkhuyenMai from './components/pages/Danhsachkhuyenmai';
import QuanlySanPham from './components/pages/Quanlysanpham';
import DanhSachSanPham from './components/pages/Danhsachsanpham';
import DanhSachSanPhamKM from './components/pages/Danhsachchuongtrinhkm';
import QuanLySanPhamKhuyenMai from './components/pages/Quanlysanphamkhuyenmai';
import Updateuser2 from './components/compoments/updatetaikhoan';
import Listtk from './components/compoments/Listtaikhoan';
import Registergg from "./components/pages/logingoogle";
import ShopSanPham from './components/pages/Shopsanpham';
import ThongKeDanhMucShopNguoiDung from './components/pages/Thongkedanhmucshopnguoidung';
import LienHe from './components/pages/Lienhe';
import GioiThieu from './components/pages/Gioithieu';

//import { startTokenRefreshInterval } from "./components/pages/Refresh";


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Layout cho người dùng */}
        <Route element={<TrangChu />}>
          <Route path="/" element={<SanPham />} />
          <Route path="shopsanpham/:idShopSanPham" element={<ShopSanPham />} />
          <Route path="register" element={<Register />} />
          <Route path="shop-register" element={<ShopRegistration />} />
          <Route path="profile" element={<Profile />} />
          <Route path='chitietsanpham/:id' element={<ChiTietSanPham />} />
          <Route path="shop-user" element={<ShopUser />} />
          <Route path="registergg" element={<Registergg />} />
          <Route path="listtaikhoan" element={<Listtk />} />
          <Route path="updateuser" element={<Updateuser2 />} />
          <Route path="quanlykhuyenmai" element={<QuanLykhuyenMai />} />
          <Route path='quanlykhuyenmai/:idKhuyenMai' element={<QuanLykhuyenMai />} />
          <Route path='danhsachkhuyenmai' element={<DanhSachkhuyenMai />} />
          <Route path='quanlysanpham' element={<QuanlySanPham />} />
          <Route path='sanpham/:idSanPham' element={<QuanlySanPham />} />
          <Route path='danhsachsanpham' element={<DanhSachSanPham />} />
          <Route path='danhsachsanphamkhuyenmai' element={<DanhSachSanPhamKM />} />
          <Route path='sanphamkhuyenmai' element={<QuanLySanPhamKhuyenMai />} />
          <Route path='sanphamkhuyenmai/:idSanPhamKhuyenMai' element={<QuanLySanPhamKhuyenMai />} />
          <Route path="lienhe" element={<LienHe />} />
          <Route path="gioithieu" element={<GioiThieu />} />
        </Route>

        {/* Layout riêng cho admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="category-management" element={<CategoryManagement />} />
          <Route path="shop-approval" element={<ShopApproval />} />
          <Route path="shop-management" element={<ShopManagement />} />
          <Route path="thongkedanhmucshop" element={<ThongKeDanhMucShopNguoiDung />} />

        </Route>

        <Route>
          <Route path="login" element={<Login />} />
        </Route>
      </>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}
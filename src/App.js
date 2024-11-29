import React from 'react';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import './App.css'; 
import TrangChu from "./components/pages/TrangChu";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile/index";
import SanPham from './components/pages/Sanpham';

import CategoryManagement from './components/pages/admin/DanhMuc/CategoryManagement';
import ShopApproval from './components/pages/admin/DuyetShop/ShopApproval';
import ShopManagement from './components/pages/admin/QuanLyShop/ShopManagement';

import AdminLayout from './components/layouts/AdminLayout';
import ShopRegistration from './components/pages/user/DangKyShop/ShopRegistration';
import ShopUser from './components/pages/user/ShopUser/ShopUser';
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

import CartPage from './components/pages/user/Cart/Cart'
import CartItem from './components/pages/user/Cart/CartItem'
import AddressForm from './components/pages/user/Cart/index'

import VoucherForm from './components/pages/Voucher/VoucherForm';
import VoucherList from './components/pages/Voucher/VoucherList';

import { AuthProvider } from "./config/Authenticated/index";
import ProtectedRoute from "./config/Authenticated/protectedRoute";
import User from "./components/userpage";
import Loginpage from "./components/loginpage";
///import { startTokenRefreshInterval } from "./components/pages/Refresh";


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Layout cho người dùng */}
        <Route element={<TrangChu />}>
          <Route path="/" element={<SanPham />} />
          <Route path="shopsanpham/:idShopSanPham" element={<ShopSanPham/>} />
          <Route path="register" element={<Register />} />
          <Route path="shop-register" element={<ShopRegistration />} />
          {/* <Route path="profile" element={<Profile />} /> */}
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

          <Route path="cart" element={<CartPage/>} />
          <Route path="cartitem" element={<CartItem />} />
          <Route path="address" element={<AddressForm />} />

          <Route path="voucherform" element={<VoucherForm />} />
          <Route path="voucherlist" element={<VoucherList />} />*
         
        <Route element={<ProtectedRoute requiredRoles={["ROLE_User", "ROLE_Staff"]} />} >
            <Route path="user" element={<User />}>
              <Route path="updateuser" element={<Updateuser2 />} />
              <Route path="profile" element={<Profile />} />
              <Route path="shop-user" element={<ShopUser />} />
              <Route path="shop-register" element={<ShopRegistration />} />
            </Route>
          </Route>
        </Route>

        {/* Layout riêng cho admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="category-management" element={<CategoryManagement />} />
          <Route path="shop-approval" element={<ShopApproval />} />
          <Route path="shop-management" element={<ShopManagement />} />


        </Route>

        <Route path="buyer" element={<Loginpage />} >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
        </Route>

      
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    //<RouterProvider router={router} />
  );
}
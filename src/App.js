import React from 'react';
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

import DangKy from "./components/compoments/Addtaikhoan";
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
// function App() {
//   return (
//     <Router>
//       <NavbarAdmin />
//       <Routes>
//         <Route path="/category-management" element={<CategoryManagement />} />
//         <Route path="/shop-approval" element={<ShopApproval />} />
//         <Route path="/" element={<CategoryManagement />} />
//         <Route path="/shop-management" element={<ShopManagement />} />
//         <Route path="/shop-register" element={<ShopRegistration />} />

//         <Route path="login" element={<Login />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="dangky" element={<DangKy />} />
//       </Routes>

//     </Router>
//   );
// }


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<TrangChu />}>
        
         
        
          {/* <Route path='/b' element={<QuanLyHoaDon />} /> */}

          {/* <Route path='/c' element={<HoSoCaNhan />} /> */}
          {/* <Route path='/d' element={<QuanLyHoaDonDaMua />} /> */}

          <Route path='/' element={<SanPham />} />
          <Route path='/chitietsanpham/:id' element={<ChiTietSanPham />} />

          <Route path="/khuyenmai" element={<QuanLykhuyenMai />} />
          <Route path='/khuyenmai/:idKhuyenMai' element={<QuanLykhuyenMai />} />
          <Route path='/danhsachkhuyenmai' element={<DanhSachkhuyenMai />} />

          {/* <Route path="/nhacungcap" element={<NhaCungCap />} />
          <Route path='/nhacungcap/:idNhaCungCap' element={<NhaCungCap />} />
          <Route path='/danhsachnhacungcap' element={<QuanLyNhaCungCap />} /> */}

          <Route path='/quanlysanpham' element={<QuanlySanPham />} />
          <Route path='/sanpham/:idSanPham' element={<QuanlySanPham />} />
          <Route path='/danhsachsanpham' element={<DanhSachSanPham />} />

          <Route path='/danhsachsanphamkhuyenmai' element={<DanhSachSanPhamKM />} />
          
          <Route path='/sanphamkhuyenmai' element={<QuanLySanPhamKhuyenMai />} />
          <Route path='/sanphamkhuyenmai/:idSanPhamKhuyenMai' element={<QuanLySanPhamKhuyenMai />} />
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

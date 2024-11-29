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
import VoucherList from './components/pages/voucherbill/VoucherList'; // Import VoucherList


import ThongKeForm from './components/pages/ThongKeForm';
import DoanhThuTable from './components/pages/DoanhThuTable';

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

        <Route path="/voucher" element={<VoucherForm/>} />
        <Route path="/voucher-list" element={<VoucherList />} /> 


        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dangky" element={<DangKy />} />
      </Routes>

    </Router>
  );
}

const App = () => {
  const [doanhThu, setDoanhThu] = useState(null);

  const handleThongKe = ({ shopId, dateType, ngay, month, year }) => {
      if (dateType === 'day') {
          api.getDoanhThuTheoNgay(shopId, ngay)
              .then(response => setDoanhThu(response.data))
              .catch(error => console.error(error));
      } else if (dateType === 'month') {
          api.getDoanhThuTheoThang(shopId, month, year)
              .then(response => setDoanhThu(response.data))
              .catch(error => console.error(error));
      } else if (dateType === 'year') {
          api.getDoanhThuTheoNam(shopId, year)
              .then(response => setDoanhThu(response.data))
              .catch(error => console.error(error));
      }
  };

  return (
      <div>
          <h1>Thống Kê Doanh Thu Shop</h1>
          <ThongKeForm onSubmit={handleThongKe} />
          <DoanhThuTable data={doanhThu} />
      </div>
  );
};

export default App;



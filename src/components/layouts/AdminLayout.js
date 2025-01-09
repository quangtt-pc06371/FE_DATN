import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        
        {/* Home Button */}
        <div className="home-button">
          <Link to="/"><i class="fa-solid fa-right-from-bracket"></i> Trang Chủ</Link>
        </div>

        <div className="admin-title mt-5">Admin</div>
        <ul>
          <li>
            <Link to="/admin/category-management">Danh Mục</Link>
          </li>
          <li>
            <Link to="/admin/shop-approval">Duyệt Cửa Hàng</Link>
          </li>
          <li>
            <Link to="/admin/shop-management">Quản Lý Cửa Hàng</Link>
          </li>
          <li>
            <Link to="/admin/user-management">Quản lý người dùng</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

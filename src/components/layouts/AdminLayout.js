import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '20px', fontWeight: 'bold', textAlign: 'center' }}>Admin</div>
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

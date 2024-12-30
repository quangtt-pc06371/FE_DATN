import React, { useState } from "react";

const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState("choxacnhan");

  return (
    <div className="container mt-4">
      <h2 className="text-center">Quản Lý Hóa Đơn</h2>

      {/* Navigation Tab */}
      <ul className="nav nav-pills justify-content-center mt-4">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "choxacnhan" ? "active" : ""}`}
            href="#choxacnhan"
            onClick={() => setActiveTab("choxacnhan")}
          >
            Chờ Xác Nhận
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "cholayhang" ? "active" : ""}`}
            href="#cholayhang"
            onClick={() => setActiveTab("cholayhang")}
          >
            Chờ Lấy Hàng
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "chogiohang" ? "active" : ""}`}
            href="#chogiohang"
            onClick={() => setActiveTab("chogiohang")}
          >
            Chờ Giao Hàng
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "dagiao" ? "active" : ""}`}
            href="#dagiao"
            onClick={() => setActiveTab("dagiao")}
          >
            Đã Giao
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "dahuy" ? "active" : ""}`}
            href="#dahuy"
            onClick={() => setActiveTab("dahuy")}
          >
            Đã Hủy
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        <div
          className={`tab-pane fade ${activeTab === "choxacnhan" ? "show active" : ""}`}
          id="choxacnhan"
        >
          <h5>Đơn hàng đang chờ xác nhận</h5>
          {/* Nội dung của tab "Chờ Xác Nhận" */}
        </div>
        <div
          className={`tab-pane fade ${activeTab === "cholayhang" ? "show active" : ""}`}
          id="cholayhang"
        >
          <h5>Đơn hàng đang chờ lấy hàng</h5>
          {/* Nội dung của tab "Chờ Lấy Hàng" */}
        </div>
        <div
          className={`tab-pane fade ${activeTab === "chogiohang" ? "show active" : ""}`}
          id="chogiohang"
        >
          <h5>Đơn hàng đang chờ giao hàng</h5>
          {/* Nội dung của tab "Chờ Giao Hàng" */}
        </div>
        <div
          className={`tab-pane fade ${activeTab === "dagiao" ? "show active" : ""}`}
          id="dagiao"
        >
          <h5>Đơn hàng đã giao</h5>
          {/* Nội dung của tab "Đã Giao" */}
        </div>
        <div
          className={`tab-pane fade ${activeTab === "dahuy" ? "show active" : ""}`}
          id="dahuy"
        >
          <h5>Đơn hàng đã hủy</h5>
          {/* Nội dung của tab "Đã Hủy" */}
        </div>
      </div>
    </div>
  );
};

export default OrderTabs;

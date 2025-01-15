import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SellerPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("allOrders");
 
  const reasonsCancel = [
    "Thay đổi địa chỉ nhận hàng",
    "Không muốn mua nữa",
    "Đặt nhầm sản phẩm",
    "Giá cao",
    "Giao hàng quá lâu",
    "Lý do khác",
  ];
  
  const fetchOrders = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Vui lòng đăng nhập.");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/order/list/shop", {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        const allOrders = response.data.donHang;
        setOrders(allOrders);
      } else {
        alert("Đã có lỗi xảy ra khi lấy danh sách đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  const XacNhanDon = async (orderId, status) => {
    try {
      const body = {
        idDonHang: orderId,
        status: status,
      };

      const response = await axios.put(
        "http://localhost:8080/api/order/updateStatusOrder",
        body,
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );

      if (response.status === 200) {
        alert("Trạng thái đơn hàng đã được cập nhật.");
        fetchOrders(); // Load lại danh sách đơn hàng
      } else {
        alert("Cập nhật trạng thái đơn hàng thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    }
  };

  const HuyDon = async (orderId, status) => {
    try {
      const body = {
        idDonHang: orderId,
        status: status,
        lyDo: "Thay đổi địa chỉ giao hàng",
      };

      const response = await axios.put(
        "http://localhost:8080/api/order/updateStatusOrder",
        body,
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );

      if (response.status === 200) {
        alert("Trạng thái đơn hàng đã được cập nhật.");
        fetchOrders(); // Load lại danh sách đơn hàng
      } else {
        alert("Cập nhật trạng thái đơn hàng thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    }
  };

  const GuiDonHang = async (orderId, status) => {
    try {
      const body = {
        idDonHang: orderId,
        status: status,
      };

      const response = await axios.put(
        "http://localhost:8080/api/order/updateStatusOrder",
        body,
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );

      if (response.status === 200) {
        alert("Trạng thái đơn hàng đã được cập nhật.");
        fetchOrders(); // Load lại danh sách đơn hàng
      } else {
        alert("Cập nhật trạng thái đơn hàng thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
 
  return (
    <div className="container mt-4">
      <h2 className="text-center">Trang Quản Lý Đơn Hàng - Seller</h2>

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
            className={`nav-link ${activeTab === "choguihang" ? "active" : ""}`}
            href="#choguihang"
            onClick={() => setActiveTab("choguihang")}
          >
            Chờ Gửi Hàng
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${
              activeTab === "chogiaohang" ? "active" : ""
            }`}
            href="#chogiohang"
            onClick={() => setActiveTab("chogiaohang")}
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
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "yeucauhuydon" ? "active" : ""}`}
            href="#yeucauhuydon"
            onClick={() => setActiveTab("yeucauhuydon")}
          >
            Yêu Cầu Trả Hàng
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {[
          "choxacnhan",
          "choguihang",
          "chogiaohang",
          "dagiao",
          "dahuy",
          "yeucauhuydon"
        ].map((tab) => (
          <div
            key={tab}
            className={`tab-pane fade ${
              activeTab === tab ? "show active" : ""
            }`}
            id={tab}
          >
            {orders.length > 0 ? (
              orders
                .filter((order) => {
                  if (tab === "allOrders") return true;
                  if (tab === "choxacnhan" && order.trangThaiDonHang === 0)
                    return true;
                  if (tab === "choguihang" && order.trangThaiDonHang === 1)
                    return true;
                  if (tab === "chogiaohang" && order.trangThaiDonHang === 2)
                    return true;
                  if (tab === "dagiao" && order.trangThaiDonHang === 3)
                    return true;
                  if (tab === "dahuy" && order.trangThaiDonHang === 5)
                    return true;
                  if (tab === "yeucauhuydon" && order.trangThaiDonHang === 4)
                    return true;
                  return false;
                })
                .map((order) => (
                  <div key={order.idDonHang} className="card mb-4">
                    <div className="card-header">
                      <h5>Đơn hàng #{order.idDonHang} - {order.hinhThucThanhToan === true ? "Chuyển Khoản" : "COD"}</h5>
                      <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {new Date(order.ngayXuatDon).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="card-body">
                      <h6>Sản phẩm</h6>
                      {order.chiTietDonHangs.map((item) => (
                        <div
                          key={item.idChiTiet}
                          className="row g-0 align-items-center mb-3"
                        >
                          <div className="col-md-3">
                            <img
                              src={item.skuEntity.hinhAnh.tenAnh}
                              alt={item.sanPhamEntity.tenSanPham}
                              className="img-fluid rounded"
                              style={{ width: "80px", height: "80px" }}
                            />
                          </div>
                          <div className="col-md-6">
                            <strong>{item.sanPhamEntity.tenSanPham}</strong>
                            <p>
                              {
                                item.skuEntity.tuyChonThuocTinhSkus[0]
                                  .tuyChonThuocTinh.giaTri
                              }
                            </p>
                          </div>
                          <div className="col-md-3">
                            <strong>
                              {item.sanPhamEntity.skus[0].giaSanPham.toLocaleString()}{" "}
                              VND
                            </strong>
                          </div>
                        </div>
                      ))}
                      <div className="text-end mt-3">
                        <strong>
                          Tổng: {order.tongSoTien.toLocaleString()} VND
                        </strong>
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                      <div>
                        <span>
                          Trạng thái:{" "}
                          {order.trangThaiDonHang === 0
                            ? "Người mua đang chờ xác nhận"
                            : order.trangThaiDonHang === 1
                            ? "Phía vận chuyển đã đến lấy hàng"
                            : order.trangThaiDonHang === 2
                            ? "Chờ giao hàng"
                            : order.trangThaiDonHang === 3
                            ? "Đã giao"
                            : "Khách hàng yêu cầu hủy - Lý do: " + order.lyDo}
                        </span>
                      </div>
                      <div>
                        {order.trangThaiDonHang === 0 && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => XacNhanDon(order.idDonHang, 1)}
                          >
                            Xác nhận
                          </button>
                        )}
                        {order.trangThaiDonHang === 4 && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>{
                              const newStatus = order.hinhThucThanhToan === true ? 9 : 5
                              XacNhanDon(order.idDonHang, newStatus)}
                            }
                          >
                            Xác nhận hủy
                          </button>
                        )}
                        {order.trangThaiDonHang === 1 && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => GuiDonHang(order.idDonHang, 2)}
                          >
                            Đã gửi hàng
                          </button>
                        )}
                        {(order.trangThaiDonHang === 1 ||
                          order.trangThaiDonHang === 0) && (
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() =>{
                              const newStatus = order.hinhThucThanhToan === true ? 9 : 5
                              HuyDon(order.idDonHang, newStatus)}
                            } 
                          >
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center">Không có đơn hàng nào.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;

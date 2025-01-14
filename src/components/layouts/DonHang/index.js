import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AdminBill = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("allOrders");
  const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
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
      console.log(token)
      if (!token) {
        alert("Vui lòng đăng nhập.");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/order/list", {
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

  async function getSanPhamKhuyenMai() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sanphamkhuyenmai"
      );
      setSanPhamKhuyenMaiForm(response.data);
    } catch (error) { }
  }
  useEffect(() => {
    getSanPhamKhuyenMai();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Trang Quản Lý Đơn Hàng</h2>

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
            className={`nav-link ${activeTab === "dagiao" ? "active" : ""}`}
            href="#dagiao"
            onClick={() => setActiveTab("dagiao")}
          >
            Đã Duyệt
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {[
          "choxacnhan",
          "dagiao",      
        ].map((tab) => (
          <div
            key={tab}
            className={`tab-pane fade ${activeTab === tab ? "show active" : ""
              }`}
            id={tab}
          >
            {orders.length > 0 ? (
              orders
                .filter((order) => {
                  if (tab === "choxacnhan" && order.trangThaiDonHang === 5)
                    return true;                
                  if (tab === "dagiao" && order.trangThaiDonHang === 6)
                    return true;                 
                  return false;
                })
                .map((order) => (
                  <div key={order.idDonHang} className="card mb-4">
                    <div className="card-header">
                      <h5>Đơn hàng #{order.idDonHang}</h5>
                      <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {new Date(order.ngayXuatDon).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="card-body">
                      <h6>Sản phẩm</h6>
                      {order.chiTietDonHangs.map((item) => {
                        const giaGoc = item.skuEntity.giaSanPham || 0;

                        const doiTuongSanPhamKM = sanPhamKhuyenMaiForm.find(
                          (kmItem) =>
                            kmItem.sanPham.idSanPham ===
                            Number(item.sanPhamEntity.idSanPham)
                        );

                        let giaSauKhuyenMai = giaGoc;
                        let khuyenMaiConHieuLuc = false;

                        if (doiTuongSanPhamKM) {
                          giaSauKhuyenMai =
                            giaGoc -
                            giaGoc *
                            (doiTuongSanPhamKM.khuyenMai.giaTriKhuyenMai /
                              100);
                          khuyenMaiConHieuLuc = true;
                        }
                        const giaHienThi = khuyenMaiConHieuLuc
                          ? giaSauKhuyenMai
                          : giaGoc;
                        const tongTien = giaHienThi * item.soLuong;

                        return (

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
                              {khuyenMaiConHieuLuc ? (
                                <>
                                  <span className="text-decoration-line-through text-muted d-block">
                                    {giaGoc.toLocaleString()} VND
                                  </span>
                                  <span className="text-danger fw-bold">
                                    {giaHienThi.toLocaleString()} VND
                                  </span>
                                </>
                              ) : (
                                <span className="fw-bold">
                                  {giaGoc.toLocaleString()} VND
                                </span>
                              )}
                            </div>

                          </div>
                        )
                      })}

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
                          {order.trangThaiDonHang === 5
                            ? "Đơn hàng đang chờ hoàn tiền"
                            : order.trangThaiDonHang === 6
                              ? "Đã hoàn tiền"                             
                                  : "Đã hủy - Lý do: " + order.lyDo}
                        </span>
                      </div>
                      <div>
                        {order.trangThaiDonHang === 5 && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => XacNhanDon(order.idDonHang, 6)}
                          >
                            Xác nhận Hoàn Tiền
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

export default AdminBill;

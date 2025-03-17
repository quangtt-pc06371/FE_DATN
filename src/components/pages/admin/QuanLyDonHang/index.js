import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaStore } from "react-icons/fa";

const AdminBill = () => {
  const [activeTab, setActiveTab] = useState("allOrders"); 
  const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/order/list/admin"
      );
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

  const XacNhanHoanTien = async (orderId, status) => {
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

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "choxacnhan" && order.trangThaiDonHang === 9) return true;
    if (activeTab === "hoantien" && order.trangThaiDonHang === 10) return true;
    return false;
  });

  const groupByShop = (order) => {
    return order.chiTietDonHangs.reduce((groups, detail) => {
      const shopId = detail.sanPhamEntity.shop.id;
      if (!groups[shopId]) {
        groups[shopId] = {
          shopName: detail.sanPhamEntity.shop.shopName,
          products: [],
        };
      }
      groups[shopId].products.push(detail);
      return groups;
    }, {});
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
    } catch (error) {}
  }
  useEffect(() => {
    getSanPhamKhuyenMai();
  }, []);
  return (
    <div className="container mt-4">
      <h2 className="text-center">Trang Quản Lý Đơn Hàng - Admin</h2>

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
            className={`nav-link ${activeTab === "hoantien" ? "active" : ""}`}
            href="#hoantien"
            onClick={() => setActiveTab("hoantien")}
          >
            Đã Hoàn Tiền
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {filteredOrders.map((order) => {
          const groupedByShop = groupByShop(order);
          return (
            <div key={order.idDonHang} className="card mb-4">
              <div className="card-header">
                <h5>
                  Đơn hàng #{order.idDonHang} -{" "}
                  {order.hinhThucThanhToan === true ? "Chuyển Khoản" : "COD"}
                </h5>
                <p>{order.ngayXuatDon}</p>
              </div>
              <div className="card-body">
                {/* Render products grouped by shop */}
                {Object.keys(groupedByShop).map((shopId) => {
                  const shop = groupedByShop[shopId];
                  return (
                    <div key={shopId}>
                      <div className="d-flex">
                        <FaStore className="me-2" />
                        <i class="bi bi-shop me-2"></i>
                        <h6>{shop.shopName}</h6>
                      </div>

                      {shop.products.map((detail) => {
                        const giaGoc = detail.skuEntity.giaSanPham || 0;

                        const doiTuongSanPhamKM = sanPhamKhuyenMaiForm.find(
                          (kmItem) =>
                            kmItem.sanPham.idSanPham ===
                            Number(detail.sanPhamEntity.idSanPham)
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
                        const tongTien = giaHienThi * detail.soLuong;
                        return (
                          <div
                            key={detail.idChiTietDonHang}
                            className="row g-0 align-items-center mb-3 border-bottom"
                          >
                            <div className="col-md-2">
                              <img
                                src={detail.skuEntity.hinhAnh.tenAnh}
                                alt={detail.sanPhamEntity.tenSanPham}
                                className="img-fluid"
                                style={{ width: "80px", height: "80px" }}
                              />
                            </div>
                            <div className="col-md-4">
                              <strong>{detail.sanPhamEntity.tenSanPham}</strong>
                              <p>
                                {
                                  detail.skuEntity.tuyChonThuocTinhSkus[0]
                                    .tuyChonThuocTinh.thuocTinh.ten
                                }{" "}
                                -{" "}
                                {
                                  detail.skuEntity.tuyChonThuocTinhSkus[0]
                                    .tuyChonThuocTinh.giaTri
                                }
                              </p>
                            </div>
                            <div className="col-md-2">
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
                            <div className="col-md-2">x{detail.soLuong}</div>
                            <div className="col-md-2  fw-bold">
                              {tongTien.toLocaleString()} VND
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <div>
                  <span>
                    Trạng thái:{" "}
                    {order.trangThaiDonHang === 9
                      ? "Đang hàng đang chờ hoàn tiền"
                      : "Đã hoàn tiền"}
                  </span>
                  <div>
                    <strong>
                      Tổng: {order.tongSoTien.toLocaleString()} VND
                    </strong>
                  </div>
                </div>
                <div>
                  {order.trangThaiDonHang === 9 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => XacNhanHoanTien(order.idDonHang, 10)}
                    >
                      Xác Nhận Hoàn Tiền
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBill;

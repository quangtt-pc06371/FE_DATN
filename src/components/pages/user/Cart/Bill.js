import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Bill = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("allOrders");
  const [actionType, setActionType] = useState(""); // New state to track action type
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
  const [orders, setOrders] = useState([]);

  const reasonsCancel = [
    "Thay đổi địa chỉ nhận hàng",
    "Không muốn mua nữa",
    "Đặt nhầm sản phẩm",
    "Giá cao",
    "Giao hàng quá lâu",
    "Lý do khác",
  ];

  const reasonsHoanTien = [
    "Sản phẩm bị hư hỏng",
    "Không đúng với hình ảnh",
    "Giao thiếu hàng",
    "Sản phầm không đúng kích cở",
    "Lý do khác",
  ];

  // Hàm hiển thị modal
  const handleOpenModal = (orderId, action) => {
    setSelectedOrderId(orderId);
    setActionType(action); // Set action type (cancel or refund)
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReason("");
  };

  // Hàm xử lý khi người dùng chọn lý do và hủy đơn
  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (actionType === "cancel") {
        await HuyDon(selectedOrderId, 4, selectedReason); // Call cancel function
      } else if (actionType === "hoantien") {
        await HoanTien(selectedOrderId, 5, selectedReason); // Call refund function
      }
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi thực hiện hành động:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const token = Cookies.get("token");
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

  const NhanDon = async (orderId, status) => {
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

  const HuyDon = async (orderId, status, reason) => {
    try {
      const body = {
        idDonHang: orderId,
        status: status,
        lyDo: reason,
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

  const HoanTien = async (orderId, status, reason) => {
    try {
      const body = {
        idDonHang: orderId,
        status: status,
        lyDo: reason,
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

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "allOrders") return true;
    if (activeTab === "choxacnhan" && order.trangThaiDonHang === 0) return true;
    if (activeTab === "choguihang" && order.trangThaiDonHang === 1) return true;
    if (activeTab === "chogiaohang" && order.trangThaiDonHang === 2)
      return true;
    if (activeTab === "dagiao" && order.trangThaiDonHang === 3) return true;
    if (activeTab === "dahuy" && order.trangThaiDonHang === 4) return true;
    if (activeTab === "hoantien" && order.trangThaiDonHang === 5) return true;
    return false;
  });

  // Group products by shop
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
      const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
      setSanPhamKhuyenMaiForm(response.data);
    } catch (error) {

    }
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
            className={`nav-link ${activeTab === "allOrders" ? "active" : ""}`}
            href="#allOrders"
            onClick={() => setActiveTab("allOrders")}
          >
            Tất Cả Đơn Hàng
          </a>
        </li>
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
            className={`nav-link ${activeTab === "chogiaohang" ? "active" : ""
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
            className={`nav-link ${activeTab === "hoantien" ? "active" : ""}`}
            href="#hoantien"
            onClick={() => setActiveTab("hoantien")}
          >
            Trả Hàng/Hoàn tiền
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
                <h5>Đơn Hàng #{order.idDonHang}</h5>
                <p>{order.ngayXuatDon}</p>
              </div>
              <div className="card-body">
                {/* Render products grouped by shop */}
                {Object.keys(groupedByShop).map((shopId) => {
                  const shop = groupedByShop[shopId];
                  return (
                    <div key={shopId}>
                      <div className="d-flex">
                        <i class="bi bi-shop me-2"></i>
                        <h6>{shop.shopName}</h6>
                      </div>




                      {shop.products.map((detail) => {
                        const giaGoc = detail.skuEntity.giaSanPham || 0;

                        const doiTuongSanPhamKM = sanPhamKhuyenMaiForm.find(
                          (kmItem) => kmItem.sanPham.idSanPham === Number(detail.sanPhamEntity.idSanPham)
                        );

                        let giaSauKhuyenMai = giaGoc;
                        let khuyenMaiConHieuLuc = false;

                        if (doiTuongSanPhamKM) {
                          giaSauKhuyenMai = giaGoc - (giaGoc * (doiTuongSanPhamKM.khuyenMai.giaTriKhuyenMai / 100));
                          khuyenMaiConHieuLuc = true;
                        }
                        const giaHienThi = khuyenMaiConHieuLuc ? giaSauKhuyenMai : giaGoc;
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
                                <span className="fw-bold">{giaGoc.toLocaleString()} VND</span>
                              )}

                            </div>
                            <div className="col-md-2">x{detail.soLuong}</div>
                            <div className="col-md-2  fw-bold">
                              {(
                                tongTien
                              ).toLocaleString()}{" "}
                              VND
                            </div>
                          </div>
                        )
                      })}




                    </div>
                  );
                })}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <div>
                  <span>
                    Trạng thái:{" "}
                    {order.trangThaiDonHang === 0
                      ? "Chờ xác nhận"
                      : order.trangThaiDonHang === 1
                        ? "Đơn hàng đã được gửi"
                        : order.trangThaiDonHang === 2
                          ? "Đơn hàng đang trên đường giao đến bạn"
                          : order.trangThaiDonHang === 3
                            ? "Đã giao"
                            : order.trangThaiDonHang === 4
                              ? "Đã hủy"
                              : "Trả hàng/Hoàn tiền"}
                  </span>

                  {/* Thông báo cho đơn hàng đã chuyển khoản */}
                  {order.hinhThucThanhToan === true && (
                    <div className="alert alert-info mt-3">
                      <h5 className="alert-heading">Thông báo quan trọng</h5>
                      <p>
                        Đơn hàng đã chuyển khoản, xin vui lòng liên hệ đến chúng
                        tôi để nhận lại tiền.
                      </p>
                      <p className="mb-0 font-weight-bold">
                        Hotline: <a href="tel:0942768652">0942768652</a>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  {order.trangThaiDonHang === 2 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => NhanDon(order.idDonHang, 3)}
                    >
                      Nhận Hàng
                    </button>
                  )}
                  {(order.trangThaiDonHang === 1 ||
                    order.trangThaiDonHang === 0) && (
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => handleOpenModal(order.idDonHang, "cancel")}
                      >
                        Hủy đơn
                      </button>
                    )}
                  {(order.trangThaiDonHang === 3 ||
                    order.trangThaiDonHang === 2) && (
                      <button
                        className="btn btn-warning btn-sm ms-2"
                        onClick={() =>
                          handleOpenModal(order.idDonHang, "hoantien")
                        }
                      >
                        Trả hàng/Hoàn tiền
                      </button>
                    )}
                </div>
                {/* Modal */}
                <div
                  className={`modal fade ${showModal ? "show" : ""}`}
                  tabIndex="-1"
                  style={{ display: showModal ? "block" : "none" }}
                  aria-hidden={!showModal}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {actionType === "cancel"
                            ? `Chọn lý do hủy đơn hàng ${selectedOrderId}`
                            : `Chọn lý do trả hàng/hoàn tiền ${selectedOrderId}`}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={handleCloseModal}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label htmlFor="cancelReason" className="form-label">
                            Lý do hủy đơn hàng:
                          </label>
                          <select
                            id="cancelReason"
                            className="form-select"
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                          >
                            <option value="">Chọn lý do...</option>
                            {(actionType === "cancel"
                              ? reasonsCancel
                              : reasonsHoanTien
                            ).map((reason, index) => (
                              <option key={index} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCloseModal}
                        >
                          Đóng
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Đang xử lý..."
                            : actionType === "cancel"
                              ? "Hủy đơn"
                              : "Trả hàng/Hoàn tiền"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bill;
